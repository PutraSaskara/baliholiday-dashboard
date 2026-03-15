"use client";
import React, { useState, useEffect } from "react";
import Card from "./Card"; // Make sure to import the Card component
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
    <div>
      <h1 className="text-center font-bold text-xl mb-10">This is Article List</h1>

      {/* Add the search input */}
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      />

      <div className="w-[100%] grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-y-2 justify-items-center">
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-10 mb-10">
        <nav>
          <ul className="flex items-center space-x-4">
            {/* Previous Button */}
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md bg-red-300 text-black"
              >
                Previous
              </button>
            </li>

            {/* Current Page Number */}
            <li className="px-4 py-2 border rounded-md bg-blue-300 text-black">
              Page {currentPage} of {totalPages}
            </li>

            {/* Next Button */}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md bg-green-300 text-black"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default ListArticle;
