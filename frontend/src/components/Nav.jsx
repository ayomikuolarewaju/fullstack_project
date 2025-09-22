import React from "react";
import Link from "next/link";

function Nav() {
  const menus = [
    { title: "Discover", go: "/discover" },
    { title: "Trending", go: "/trending" },
    { title: "My List", go: "/mylist" },
  ];
  return (
    <div className="flex items-center justify-around mx-auto p-4 text-white w-full h-[100px] mb-[100px]">
      <div className="flex items-center justify-between w-[800px] p-4 gap-5">
        <div className="font-san text-2xl font-bold text-red-800 w-1/3 ">
          <Link href="/">
            <h1 className="font-dance text-3xl font-bold">cinematch</h1>
          </Link>
        </div>
        <div className="flex items-center justify-between  font-semibold text-black no-underline w-2/3">
          {menus.map((menu, index) => (
            <div key={index}>
              <div><a href={menu.go}>
                <p className="cursor-pointer w-[100px] text-center">{menu.title}</p>
              </a></div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md w-[200px]">
        <input type="text" alt="search" />
      </div>
      <div>
        <button className="p-3 text-white rounded-lg w-[100px] bg-red-800 mx-auto font-bold capitalise cursor-pointer">
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Nav;
