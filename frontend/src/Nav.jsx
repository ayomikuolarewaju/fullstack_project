import React from "react";

function Nav() {
  const menus = [
    { title: "Discover", href: "/discover" },
    { title: "Trending", href: "/trending" },
    { title: "My List", href: "/mylist" },
  ];
  return (
    <div className="flex items-center justify-around mx-auto p-4 bg-gray-800 text-white w-full h-[100px]">
      <div>
        <img src="./assets/react.svg" width={100} height={100} alt="image" />
      </div>
      <div className="flex items-center justify-between px-4 w-[500px] font-semibold text-black underline">
        {menus.map((menu, index) => (
          <div key={index}>
            <a href={menu.href}>{menu.title}</a>
          </div>
        ))}
      </div>
      <div>
        <input type="text" alt="search" className="rounded-lg p-5 w-[200px]" />
      </div>
      <div className="bg-red-800 p-2 rounded text-white cursor-pointer">
        <button className="bg-red-800 p-2 rounded-md">sign in</button>
      </div>
    </div>
  );
}

export default Nav;
