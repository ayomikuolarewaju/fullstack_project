"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function MyListPage() {
  const [list, setList] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchList = async () => {
      const res = await fetch("/api/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setList(json.data || []);
    };

    fetchList();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!list.length) return;
      const map = {};
      await Promise.all(
        list.map(async (entry) => {
          try {
            const res = await fetch(`/api/movies/${entry.movie_id}`);
            const json = await res.json();
            map[entry.movie_id] = json.data;
          } catch (e) {
            // ignore missing
          }
        })
      );
      setMovieDetails(map);
    };
    fetchDetails();
  }, [list]);

  if (!localStorage.getItem("token"))
    return <p className="p-6">Please sign in to view your list.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>

      {list.length === 0 ? (
        <p>No movies saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((entry) => {
            const movie = movieDetails[entry.movie_id];
            return (
              <div key={entry.id} className="border p-3 rounded">
                {movie ? (
                  <>
                    <h3 className="font-bold">{movie.title}</h3>
                    <p className="text-sm text-gray-600">
                      {movie.year} • {movie.genreName}
                    </p>
                    <p className="text-sm mt-2 line-clamp-3">
                      {movie.details?.synopsis}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/movies/${movie.id}`}
                        className="px-3 py-1 border rounded"
                      >
                        Details
                      </Link>
                      <button
                        onClick={async () => {
                          const token = localStorage.getItem("token");
                          await fetch(`/api/watchlist/${entry.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          setList((s) => s.filter((x) => x.id !== entry.id));
                        }}
                        className="px-3 py-1 bg-red-800 text-white rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Loading movie details...</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
