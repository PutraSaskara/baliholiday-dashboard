// components/InfoModal.jsx

import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import FocusLock from "react-focus-lock";
import Image from "next/image";

const InfoModal = ({ isOpen, onClose, title, imageSrc, description, additionalInfo }) => {
  // Handle closing with Esc key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Handle clicking outside the modal content
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <FocusLock>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto relative mx-4 transform transition-transform duration-300 scale-100 opacity-100">
          {/* Close Icon */}
          <button
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 focus:outline-none"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <FaTimes size={24} />
          </button>

          {/* Modal Content */}
          <div className="flex flex-col lg:flex-row">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={title}
                className="w-full lg:w-1/2 h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-4 lg:mb-0 lg:mr-6"
                loading="lazy"
              />
            ) : (
              <div className="w-full lg:w-1/2 h-48 sm:h-56 md:h-64 bg-gray-200 rounded-lg mb-4 lg:mb-0 lg:mr-6 flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
            <div className="flex flex-col justify-center">
              {title && <h3 className="text-2xl font-semibold mb-2">{title}</h3>}
              {description && (
                <p className="text-gray-600 mb-4 whitespace-pre-wrap break-words">
                  {description}
                </p>
              )}
              {additionalInfo && (
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  {additionalInfo.map((info, index) => (
                    <div key={index}>
                      <strong>{info.label}:</strong> {info.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FocusLock>
  );
};

export default InfoModal;
