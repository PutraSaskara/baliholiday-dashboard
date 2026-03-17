"use client";
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Card from "./Card";
import useArticleStore from "../stores/useArticleStore";

function ListArticle() {
  // Original codebase uses "tours" state for articles, alias articles -> tours
  const { articles: tours, loading, error, fetchArticles, deleteArticle } = useArticleStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Define how many items per page

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (Id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (confirmDelete) {
      await deleteArticle(Id);
    }
  };

  // Handle pagination logic
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filter articles based on search query
  const filteredTours = tours.filter((tour) =>
    tour.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the current page data
  const indexOfLastTour = currentPage * itemsPerPage;
  const indexOfFirstTour = indexOfLastTour - itemsPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);

  // Function to replace spaces with hyphens in the title for the URL
  const convertSpaceToDash = (title) => {
    return title.replace(/\s+/g, '-'); // Replace spaces with hyphens
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header and Search Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Articles</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and publish your blog content.</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <FiSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search articles by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      {loading && tours.length === 0 ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {filteredTours.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-200 dark:border-gray-700">
               <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found matching that title.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
        {currentTours.map((tour) => (
          <Card
            key={tour.id}
            title={tour.title}
            author={tour.author}
            img={tour.blogimage?.imageUrl1}
            desc={tour.blog_paragraf?.paragraf1}
            link={`/edit-article/${tour.id}`}
            // Update link2 to use the convertSpaceToDash function
            link2={`https://baliholiday.xyz/blog/${convertSpaceToDash(tour.title)}`}
            onDelete={() => handleDelete(tour.id)}
          />
        ))}
      </div>
          )}

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex justify-center mt-12 mb-16">
          <nav aria-label="Page navigation" className="flex items-center gap-2 sm:gap-4">
            {/* First Button */}
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            >
              First
            </button>

            {/* Previous Button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            >
              Previous
            </button>

            {/* Current Page Number */}
            <div className="flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
              Page <span className="font-bold text-gray-900 dark:text-white mx-1.5">{currentPage}</span> of <span className="font-bold text-gray-900 dark:text-white mx-1.5">{totalPages}</span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            >
              Next
            </button>

            {/* Last Button */}
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            >
              Last
            </button>
          </nav>
        </div>
      )}
        </>
      )}
    </div>
  );
}

export default ListArticle;
