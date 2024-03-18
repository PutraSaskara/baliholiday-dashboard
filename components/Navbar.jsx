import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <>
      <div className="bg-[#344955] h-[100vh] w-[120px] hidden lg:flex md:flex-col pl-1 relative ">
        <div className="m-auto flex items-center">
          <ul className="text-[#344955] flex flex-col absolute left-5 items-center justify-center">
            <li>
              <Link
                href={"/"}
                type="button"
                class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[12px] px-2 py-2.5 text-center me-2 mb-2"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href={"/add-blog"}
                type="button"
                class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white  shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[12px] px-2 py-2.5 text-center me-2 mb-2"
              >
                Add Blog
              </Link>
            </li>
            <li>
              <Link
                href={"/add-tour-package"}
                type="button"
                class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white  shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[12px] px-2 py-2.5 text-center me-2 mb-2"
              >
                Add Tour Package
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-[#344955] w-full flex lg:hidden">
        <div className="m-auto">
          <ul className="text-[#344955] flex justify-center items-center mt-4">
            <li>
              <Link
                href={"/"}
                type="button"
                class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[10px] px-2 py-2.5 text-center me-2 mb-2"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href={"/add-blog"}
                type="button"
                class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white  shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[10px] px-2 py-2.5 text-center me-2 mb-2"
              >
                Add Blog
              </Link>
            </li>
            <li>
              <Link
                href={"/add-tour-package"}
                type="button"
                class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white  shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[10px] px-2 py-2.5 text-center me-2 mb-2"
              >
                Add Tour Package
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
