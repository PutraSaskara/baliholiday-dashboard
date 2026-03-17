import Image from "next/image";
import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

function Card({ title, author, img, desc, link, link2, onDelete }) {
  const handleDelete = (event) => {
    event.preventDefault();
    onDelete();
  };

  return (
    <div className="group w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <Link href={link}>
          <Image 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
            src={img || '/placeholder.jpg'} 
            alt={title || 'Image'} 
          />
        </Link>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link href={link}>
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 transition-colors">
              {title}
            </h5>
            {author && (
              <p className="mb-3 font-medium text-blue-600 dark:text-blue-400 text-xs uppercase tracking-wider">
                {author}
              </p>
            )}
          </Link>
          <p className="mb-4 font-normal text-gray-600 dark:text-gray-400 line-clamp-3 text-sm leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-center gap-2">
            <Link
              href={link}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
            >
              <FaEdit className="mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600"
            >
              <MdDelete className="mr-2" />
              Delete
            </button>
          </div>

          <Link
            href={link2}
            className="w-full inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-xl shadow-sm transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            target="_blank"
          >
            <FiExternalLink className="mr-2" />
            View Public Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
