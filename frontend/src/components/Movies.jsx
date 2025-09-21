"use client";
import { useState, useEffect } from "react";

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
      <div className="grid grid-cols-3 items-center justify-center w-[1200px] gap-4   ">
        {dt[no]?.movies.map((movie, index) => (
          <div key={index} className="p-4 border rounded">
            <h2>{movie.title}</h2>
            <p>{movie.duration}</p>
          </div>
        ))}
      </div>
      {dt[no]?.movies.map((n) => console.log(n))}
    </div>
  );
}

export default Movies;
