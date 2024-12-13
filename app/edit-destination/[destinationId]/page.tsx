// app/edit-destination/[destinationId]/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import DestinationForm from "../../../components/DestinationForm";
import Navbar from "../../../components/Navbar";
import axios from "axios";

interface PageProps {
  params: {
    destinationId: string;
  };
}

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  lat: number;
  lng: number;
  // Add other fields as necessary
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { destinationId } = params;
  const [existingData, setExistingData] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDestination = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get<Destination>(`http://localhost:5000/api/destinations/${destinationId}`);
      setExistingData(res.data);
      setError(null);
    } catch (err: any) {
      if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data.message}`);
      } else if (err.request) {
        setError("No response from the server. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Error fetching destination:", err);
    } finally {
      setIsLoading(false);
    }
  }, [destinationId]);

  useEffect(() => {
    if (destinationId) {
      fetchDestination();
    }
  }, [destinationId, fetchDestination]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center mt-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <p className="text-red-500 text-center mt-6">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {existingData ? (
        <DestinationForm isEditMode={true} existingData={existingData} />
      ) : (
        <p className="text-center mt-6">No destination data available.</p>
      )}
    </div>
  );
};

export default Page;
