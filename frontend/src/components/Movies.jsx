"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import img from "../../public/images/1600.png";

function Movies() {
  const [dt, setDt] = useState([]);
  const [no, setNo] = useState(0);

  useEffect(() => {
    const data = async () => {
      try {
        const res = await fetch("/data/movies.json");
        const moviesJson = await res.json();
        setDt(moviesJson.data.genres);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    data();
  }, []);

  let movieList = [
    { id: 0, title: "Action" },
    { id: 1, title: "Comedy" },
    { id: 2, title: "Drama" },
    { id: 3, title: "Horror" },
    { id: 4, title: "Romance" },
    { id: 5, title: "Sci-Fi" },
    { id: 6, title: "Animation" },
    { id: 7, title: "Documentary" },
  ];

  const handclicker = (x) => {
    if (x === movieList.length) {
      setNo(x);
    } else {
      setNo(x);
    }
  };

  const addToMyList = async (movieId) => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:3000/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieId }),
    });
    alert("Movie added to your list!");
  };

  return (
    <div className="flex flex-col mx-auto w-[1400px] relative top-[150px] space-y-10">
      <div className="flex justify-between items-center space-x-[20px] w-[1200px] font-bold text-red-800 cursor-pointer">
        {movieList.map((m, index) => (
          <div key={index} onClick={() => handclicker(m.id)}>
            {m.id === no ? (
              <h4 className="bg-red-800 text-white p-2 rounded-md text-center w-[120px]">
                {m.title}
              </h4>
            ) : (
              <h4>{m.title}</h4>
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 items-center justify-center w-[1200px] gap-4 mb-10   ">
        {dt[no]?.movies.map((movie, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-2xl space-y-5 w-[350px] flex flex-col justify-between items-start"
          >
            <div className="flex flex-col">
              <div>
                <Image width={330} height={300} alt="movie_img" src={img} />
              </div>
              <div className="absolute top-[120px] z-50 ">
                <p className="flex justify-center items-center space-x-10 w-[70px] text-red-500">
                  {movie.rating}
                  <em>
                    <FaStar color="yellow" />
                  </em>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">{movie.title}</h2>
            </div>
            <div className="flex justify-between items-center w-full">
              <p>{movie.year}</p>
              <p>{movie.duration}</p>
            </div>
            <div>
              <p>{movie.details.synopsis}</p>
            </div>
            <div className="flex justify-between w-full items-center">
              <p className="p-2 rounded-md bg-red-200 text-red-800 font-bold">
                {dt[no]?.name}
              </p>
              <p>
                <FaStar color="red" />
              </p>
            </div>
            <div>
              <button
                onClick={() => addToMyList(movie.id)}
                className="bg-red-800 text-white px-3 py-1 rounded mt-2 cursor-pointer"
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

export default Movies;
