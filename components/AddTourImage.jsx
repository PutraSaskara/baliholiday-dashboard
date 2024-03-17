"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig';

function AddTourImage() {
    const [tourId, setTourId] = useState('');
    const [images1, setImages1] = useState([]);
    const [images2, setImages2] = useState([]);
    const [images3, setImages3] = useState([]);
    const [error, setError] = useState('');
    const [tourOptions, setTourOptions] = useState([]);
    const [preview1, setPreview1] = useState('');
    const [preview2, setPreview2] = useState('');
    const [preview3, setPreview3] = useState('');

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await axios.get(`${baseURL}/tours`);
                setTourOptions(response.data);
            } catch (error) {
                console.error('Error fetching tours:', error);
            }
        };

        fetchTours();
    }, []);

    const handleTourIdChange = (event) => {
        setTourId(event.target.value);
    };

    const handleImageChange1 = (event) => {
        setImages1(event.target.files);
        setPreview1(URL.createObjectURL(event.target.files[0]));
    };

    const handleImageChange2 = (event) => {
        setImages2(event.target.files);
        setPreview2(URL.createObjectURL(event.target.files[0]));
    };

    const handleImageChange3 = (event) => {
        setImages3(event.target.files);
        setPreview3(URL.createObjectURL(event.target.files[0]));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (!tourId.trim()) {
                setError('Tour ID is required');
                return;
            }

            if (images1.length !== 1 || images2.length !== 1 || images3.length !== 1) {
                setError('Please select exactly one image for each field');
                return;
            }

            const formData = new FormData();
            formData.append('tourId', tourId);
            formData.append('image', images1[0]);
            formData.append('image', images2[0]);
            formData.append('image', images3[0]);

            const response = await axios.post(`${baseURL}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Images uploaded successfully:', response.data);
            // Optionally, reset form fields
            setTourId('');
            setImages1([]);
            setImages2([]);
            setImages3([]);
            setError('');
            setPreview1('');
            setPreview2('');
            setPreview3('');
            alert('Images uploaded successfully');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('An error occurred while uploading images');
            }
        }
    };

    return (
        <div>
            <h2>Add Tour Image</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="tourId">Choose Tour Title:</label>
                    <select id="tourId" value={tourId} onChange={handleTourIdChange}>
                        <option value="">Select a Tour</option>
                        {tourOptions.map(tour => (
                            <option key={tour.id} value={tour.id}>{tour.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="images1">Select Image 1:</label>
                    <input type="file" id="images1" accept="image/*" onChange={handleImageChange1} />
                    {preview1 && <img src={preview1} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
                </div>
                <div>
                    <label htmlFor="images2">Select Image 2:</label>
                    <input type="file" id="images2" accept="image/*" onChange={handleImageChange2} />
                    {preview2 && <img src={preview2} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
                </div>
                <div>
                    <label htmlFor="images3">Select Image 3:</label>
                    <input type="file" id="images3" accept="image/*" onChange={handleImageChange3} />
                    {preview3 && <img src={preview3} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
                </div>
                <button type="submit">Upload Images</button>
                {error && <div>Error: {error}</div>}
            </form>
        </div>
    );
}

export default AddTourImage;
