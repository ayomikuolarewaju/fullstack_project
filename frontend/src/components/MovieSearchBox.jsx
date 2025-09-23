"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("popularity");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (year) params.append("year", year);
    if (minRating) params.append("minRating", minRating);
    if (genre) params.append("genre", genre);
    if (sort) params.append("sort", sort);
    params.append("limit", 50);

    try {
      const res = await fetch(`/api/movies?${params.toString()}`);
      const json = await res.json();
      setMovies(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  const addToMyList = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to save to your list.");
    await fetch("/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieId }),
    });
    alert("Added to your list");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mb-[100px]">
      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="border p-2 flex-1"
        />
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year (e.g. 2023 or 2020,2021)"
          className="border p-2 w-[140px]"
        />
        <input
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          placeholder="Min rating"
          className="border p-2 w-[100px]"
          type="number"
          min="0"
          max="10"
          step="0.1"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2"
        >
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
        </select>
        <button type="submit" className="bg-red-800 text-white px-4 rounded">
          Search
        </button>
      </form>

      {loading ? <p>Loading...</p> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="border p-4 rounded shadow">
            <div className="relative h-48 w-full rounded overflow-hidden mb-3">
              {/* use image_url if served; fallback to static */}
              <Image
                src={movie.image_url?.replace(/^../, "") || "/images/1600.png"}
                alt={movie.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <p className="text-sm text-gray-600">
                  {movie.year} • {movie.duration}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <FaStar />
                  <span className="font-semibold">{movie.rating ?? "-"}</span>
                </div>
                <p className="text-xs bg-red-100 text-red-800 px-2 rounded mt-2">
                  {movie.genreName}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm line-clamp-3">
              {movie.details?.synopsis}
            </p>

            <div className="flex gap-2 mt-4">
              <Link href={`/movies/${movie.id}`}>
                <button className="px-3 py-1 border rounded">Details</button>
              </Link>

              <button
                onClick={() => addToMyList(movie.id)}
                className="px-3 py-1 bg-red-800 text-white rounded"
              >
                + My List
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
