import React from "react";

function BlogNavbar() {
  return (
    <nav className="bg-gray-200 shadow shadow-gray-300 w-[100%] px-8 md:px-auto">
      <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
          <ul className="flex font-semibold justify-between">
            {/* <!-- Active Link = text-indigo-500
                Inactive Link = hover:text-indigo-500 --> */}
            <li className="md:px-4 md:py-2 hover:text-indigo-400">
              <a href="/add-tour-package/add-tour">add tour</a>
            </li>
            <li className="md:px-4 md:py-2 hover:text-indigo-400">
              <a href="/add-tour-package/add-tour-plan">add tour plan</a>
            </li>
            <li className="md:px-4 md:py-2 hover:text-indigo-400">
              <a href="/add-tour-package/add-tour-desc">add tour description</a>
            </li>
            <li className="md:px-4 md:py-2 hover:text-indigo-400">
              <a href="/add-tour-package/add-tour-image">add tour image</a>
            </li>
            <li className="md:px-4 md:py-2 hover:text-indigo-400">
              <a href="/add-tour-package/add-other">add other information</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default BlogNavbar;
