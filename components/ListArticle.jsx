"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import  Card from "./Card"; // Make sure to import the Card component
import baseURL from "@/apiConfig";

function ListArticle() {
  const [tours, setTours] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Add this state

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await axios.get(`${baseURL}/single-blog`);
      setTours(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleDelete = async (Id) => {
    // Show a confirmation dialog before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`${baseURL}/tours/${Id}`);
        // After successful deletion, update the list of blogs by refetching them
        fetchTours();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
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
        {tours
          .filter((tour) =>
            tour.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((tour) => (
            <Card
              key={tour.id}
              title={tour.title}
              author={tour.author}
              img={tour.blogimage?.imageUrl1}
              desc={tour.blog_paragraf?.paragraf1}
              link={`/edit-article/${tour.id}`}
              link2={`/article/${tour.id}`}
              onDelete={() => handleDelete(tour.id)}
            />
          ))}
      </div>
    </div>
  );
}

export default ListArticle;
