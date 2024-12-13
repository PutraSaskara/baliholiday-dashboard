"use client"
// components/DestinationItem.jsx

import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import InfoModal from "./InfoModal";
import { useState } from "react";
import Image from "next/image";
import baseURL from '@/apiConfig';

const DestinationItem = ({ destination, isSelected, onSelect, onShowDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowDetails = () => {
    onShowDetails(destination);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center">
      {/* Destination Image */}
      <div className="w-16 h-16 relative mr-4">
        <Image
          src={`${baseURL}/api${destination.image}`}
          alt={destination.name}
          layout="fill"
          objectFit="cover"
          className="rounded"
        />
      </div>

      {/* Destination Name */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{destination.name}</h3>
      </div>

      {/* Icons on the Right Side */}
      <div className="flex space-x-2">
        {/* Choose Destination Icon with Tooltip */}
        <span className="relative group">
          <span
            className={`cursor-pointer relative ${
              isSelected ? 'text-blue-500 cursor-not-allowed' : 'text-gray-500'
            } transition-colors duration-300 transform ${
              isSelected ? '' : 'hover:scale-110'
            }`}
            onClick={() => {
              if (!isSelected) {
                onSelect(destination);
              }
            }}
            aria-label={
              isSelected
                ? "Destination Selected"
                : "Select Destination"
            }
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isSelected) {
                onSelect(destination);
              }
            }}
          >
            <FaCheckCircle size={20} />
          </span>
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {isSelected ? 'Destination Selected' : 'Select Destination'}
          </div>
        </span>

        {/* Show More Information Icon with Tooltip */}
        <span className="relative group">
          <span
            className="text-blue-500 cursor-pointer"
            onClick={handleShowDetails}
            aria-label="Destination Information"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleShowDetails();
            }}
          >
            <FaInfoCircle size={20} />
          </span>
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Destination Information
          </div>
        </span>
      </div>

      {/* InfoModal for Destination Details */}
      <InfoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={destination.name}
        imageSrc={`http://localhost:5000${destination.image}`}
        description={destination.description}
        additionalInfo={[
          { label: "Latitude", value: destination.lat },
          { label: "Longitude", value: destination.lng },
        ]}
      />
    </div>
  );
};

export default DestinationItem;
