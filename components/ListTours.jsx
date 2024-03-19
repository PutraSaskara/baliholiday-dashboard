"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import baseURL from '@/apiConfig'


function ListTours() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await axios.get(`${baseURL}/tours`);
      setTours(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

//   const handleDelete = async (blogId) => {
//     // Show a confirmation dialog before deleting
//     const confirmDelete = window.confirm("Are you sure you want to delete this blog post?");
    
//     if (confirmDelete) {
//       try {
//         await axios.delete(`https://server.saskaraputra.com/blogs/${blogId}`);
//         // After successful deletion, update the list of blogs by refetching them
//         fetchBlogs();
//       } catch (error) {
//         console.error("Error deleting blog:", error);
//       }
//     }
//   };\

console.log('data tour', tours)

  return (
    <div className="w-[100%] grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-y-2 justify-items-center">
      {tours?.map((tour) => (
        <Card
          key={tour.id}
          title={tour.title}
          author={tour.price1}
          img={tour.image?.imageUrl1}
          desc={tour.tour_description?.paragraf1}
          link={`/${tour.id}`}
          link2={`/article/${tour.id}`}
        //   onDelete={() => handleDelete(tour.id)} // Pass the delete function as a prop
        />
      ))}
    </div>
  );
}

export default ListTours;
