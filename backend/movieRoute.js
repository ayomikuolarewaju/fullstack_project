// movieRoute.js
import express from "express";
import loadMovies from "./moviesData.js";
import con from "./connect.js"; // your pg client
const router = express.Router();

/**
 * GET /api/movies
 * Query params:
 *   q - search string for title
 *   year - exact year or comma-separated years
 *   minRating - minimum rating (number)
 *   genre - genre name or id
 *   discover - true/false
 *   trending - true/false
 *   sort - rating|year|popularity (popularity = trending + discover flags)
 *   limit, offset
 */
router.get("/", async (req, res, next) => {
  try {
    const { movies } = loadMovies();
    const {
      q,
      year,
      minRating,
      genre,
      discover,
      trending,
      sort,
      limit = 50,
      offset = 0,
    } = req.query;

    let results = [...movies];

    if (q) {
      const qlc = q.toLowerCase();
      results = results.filter((m) => m.title.toLowerCase().includes(qlc));
    }

    if (year) {
      const years = String(year)
        .split(",")
        .map((y) => parseInt(y, 10));
      results = results.filter((m) => years.includes(Number(m.year)));
    }

    if (minRating) {
      results = results.filter((m) => Number(m.rating) >= Number(minRating));
    }

    if (genre) {
      const g = genre.toLowerCase();
      results = results.filter(
        (m) => m.genreName?.toLowerCase() === g || String(m.genreId) === genre
      );
    }

    if (discover !== undefined) {
      const val = discover === "true";
      results = results.filter((m) => Boolean(m.discover) === val);
    }

    if (trending !== undefined) {
      const val = trending === "true";
      results = results.filter((m) => Boolean(m.trending) === val);
    }

    // Add popularity score (simple): trending + discover + rating
    results = results.map((m) => ({
      ...m,
      popularityScore:
        (m.trending ? 2 : 0) + (m.discover ? 1 : 0) + Number(m.rating || 0),
    }));

    // Sorting
    if (sort === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sort === "year") {
      results.sort((a, b) => b.year - a.year);
    } else if (sort === "popularity") {
      results.sort((a, b) => b.popularityScore - a.popularityScore);
    }

    const paged = results.slice(Number(offset), Number(offset) + Number(limit));
    res.json({ success: true, count: results.length, data: paged });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { movies } = loadMovies();
    const movie = movies.find((m) => m.id === req.params.id);
    if (!movie)
      return res.status(404).json({ success: false, error: "Movie not found" });

    const reviewRes = await con.query(
      "SELECT r.*, u.name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE movie_id = $1 ORDER BY created_at DESC",
      [req.params.id]
    );
    const reviews = reviewRes.rows || [];
    const avg = reviews.length
      ? +(
          reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length
        ).toFixed(2)
      : null;

    res.json({
      success: true,
      data: { ...movie, reviews, averageRating: avg },
    });
  } catch (err) {
    next(err);
  }
});

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.get("/recommendations", async (req, res, next) => {
  try {
    const { movies } = loadMovies();

    // attempt to read token from header
    const authHeader = req.headers.authorization;
    let userId = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
        userId = decoded.id;
      } catch (e) {
        userId = null;
      }
    }

    if (userId) {
      // get watchlist movie ids
      const wlRes = await con.query(
        "SELECT movie_id FROM watchlist WHERE user_id = $1",
        [userId]
      );
      const movieIds = wlRes.rows.map((r) => r.movie_id);

      if (movieIds.length) {
        // collect genres of watchlist movies
        const watchGenres = new Set(
          movies.filter((m) => movieIds.includes(m.id)).map((m) => m.genreName)
        );

        let recs = movies.filter(
          (m) => watchGenres.has(m.genreName) && !movieIds.includes(m.id)
        );
        // rank by rating + trending
        recs = recs
          .map((m) => ({
            ...m,
            score: (m.trending ? 2 : 0) + Number(m.rating || 0),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 20);

        return res.json({
          success: true,
          source: "watchlist_genre",
          data: recs,
        });
      }
    }

    const fallback = movies
      .filter((m) => m.discover || m.trending)
      .map((m) => ({
        ...m,
        score: (m.trending ? 2 : 0) + Number(m.rating || 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.json({ success: true, source: "fallback", data: fallback });
  } catch (err) {
    next(err);
  }
});

export default router;
