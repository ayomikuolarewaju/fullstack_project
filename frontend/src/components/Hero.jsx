import React from "react";
import HeroImg from "../../public/images/cinema.jpg";
import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center mx- w-full h-[300px]">
      <div>
        <Image
          src={HeroImg}
          alt="Hero Image"
          className="w-[1000px] h-[400px] object-cover rounded-2xl"
        />
      </div>
      <div className="absolute top-[230px] z-50 text-white w-[700px] mx-auto flex flex-col space-y-5 bg-gray-800/40 p-4">
        <h1 className="text-4xl text-center font-bold">
          Discover Your Next Favorite Movie
        </h1>
        <p className="w-[500px] font-medium text-lg text-white text-center">
          Get personalised movies based on your taste.Join million of movies
          lovers finding their match.
        </p>
        <button className="p-3 text-white rounded-lg w-[200px] bg-red-800 mx-auto font-bold cursor-pointer">
          <Link href="/discover">Start Discovering</Link>
        </button>
      </div>
    </div>
  );
}

export default Hero;
