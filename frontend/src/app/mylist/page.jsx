"use client";
import { useEffect, useState } from "react";

export default function MyListPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/watchlist", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMovies(data.data || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
      {movies.length === 0 ? (
        <p>No movies in your list yet.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <li key={movie.id} className="border p-3 rounded">
              Movie ID: {movie.movie_id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
