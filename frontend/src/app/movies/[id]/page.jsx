"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    setLoading(true);
    const res = await fetch(`/api/movies/${id}`);
    const json = await res.json();
    setMovie(json.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to submit a review.");

    await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieId: id, rating: Number(rating), comment }),
    });

    setComment("");
    setRating(5);
    fetchDetail();
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!movie) return <p className="p-6">Movie not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex gap-6">
        <div className="w-1/3 h-80 relative">
          <Image
            src={movie.image_url?.replace(/^../, "") || "/images/1600.png"}
            alt={movie.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {movie.title}{" "}
            <span className="text-sm font-medium">({movie.year})</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <FaStar /> <strong>{movie.averageRating ?? movie.rating}</strong>
            <span className="ml-4 text-sm text-gray-600">
              {movie.genreName}
            </span>
          </div>
          <p className="mt-4">{movie.details?.synopsis}</p>

          <div className="mt-4">
            <p>
              <strong>Director:</strong> {movie.details?.director}
            </p>
            <p>
              <strong>Cast:</strong> {(movie.details?.cast || []).join(", ")}
            </p>
            <p>
              <strong>Language:</strong> {movie.details?.language}
            </p>
            <p>
              <strong>Duration:</strong> {movie.duration}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {movie.reviews?.length ? (
          <div className="space-y-3 mt-3">
            {movie.reviews.map((r) => (
              <div key={r.id} className="border p-3 rounded">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{r.name || "Anonymous"}</p>
                  <p>⭐ {r.rating}</p>
                </div>
                <p className="text-sm mt-2">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm">No reviews yet</p>
        )}

        <form onSubmit={submitReview} className="mt-6 space-y-2">
          <label className="block">Your rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-2 w-24"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 w-full"
            placeholder="Write your review"
          />
          <button
            type="submit"
            className="bg-red-800 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </form>
      </section>
    </div>
  );
}
