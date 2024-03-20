import React from "react";

function ArticleNavbar() {
  return (
    <nav className="bg-gray-200 shadow shadow-gray-300 w-[100%] md:px-auto">
      <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-center flex-wrap md:flex-nowrap">
        <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
          <ul className="flex justify-between gap-2 text-[12px]">
            {/* <!-- Active Link = text-indigo-500
                Inactive Link = hover:text-indigo-500 --> */}
            <li className="md:px-4 md:py-2 hover:text-indigo-400 bg-blue-200 px-1 flex justify-center items-center">
              <a href="/add-article/add-single-article">add single article</a>
            </li>
            <li className="md:px-4 md:py-2 hover:text-indigo-400 bg-blue-200 px-1 flex justify-center items-center">
              <a href="/add-article/add-article-paragrafs">add article paragrafs</a>
            </li>
            <li className="md:px-4 md:py-2 hover:text-indigo-400 bg-blue-200 px-1 flex justify-center items-center">
              <a href="/add-article/add-article-images">add article image</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default ArticleNavbar;
