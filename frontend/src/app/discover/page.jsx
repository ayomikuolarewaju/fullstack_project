"use client"

import React from "react";
import { useState, useEffect } from "react";

function page() {
  const [dt, setDt] = useState([]);

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
  return <div>
    {console.log(dt)}
  </div>;
}

export default page;
