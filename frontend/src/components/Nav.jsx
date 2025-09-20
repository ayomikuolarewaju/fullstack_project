import React from "react";

function Nav() {
  const menus = [
    { title: "Discover", href: "/discover" },
    { title: "Trending", href: "/trending" },
    { title: "My List", href: "/mylist" },
  ];
  return (
    <div className="flex items-center justify-around mx-auto p-4 text-white w-full h-[100px]">
      <div className="flex items-center justify-between w-[500px]">
        <div className="text-lg font-serif text-red-800">
          <a href="/">
            <h1>cinematch</h1>
          </a>
        </div>
        <div className="flex items-center justify-between w-[300px] font-semibold text-black underline">
          {menus.map((menu, index) => (
            <div key={index}>
              <a href={menu.href}>{menu.title}</a>
            </div>
          ))}
        </div>
      </div>

      <div>
        <input type="text" alt="search" className="rounded-lg p-5 w-[200px]" />
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
