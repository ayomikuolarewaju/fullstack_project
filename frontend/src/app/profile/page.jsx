"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);

    // fetch watchlist
    fetch("/api/watchlist", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((j) => setWatchlist(j.data || []));
  }, []);

  if (!user) return <p className="p-6">Please log in</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-2">
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>User ID:</strong> {user.id}
      </p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Your activity</h2>
        <p className="mt-2">Watchlist items: {watchlist.length}</p>
        <Link
          href="/mylist"
          className="inline-block mt-3 px-3 py-1 bg-red-800 text-white rounded"
        >
          View My List
        </Link>
      </section>
    </div>
  );
}
