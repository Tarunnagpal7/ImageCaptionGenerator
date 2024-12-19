import { useState } from 'react';

const App=()=>{
  const [image, setImage] = useState(null); // Stores the uploaded image file
  const [imagePreview, setImagePreview] = useState(null); // Stores the preview URL
  const [caption, setCaption] = useState(''); // Stores the predicted caption
  const [loading, setLoading] = useState(false); // Loading state

  // Handle file upload (browse or drag/drop)
  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set preview URL
    } else {
      alert('Please upload a valid image file.');
    }
  };

  // Handle drag and drop events
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  // Handle submit button
  const handleSubmit = async () => {
    if (!image) {
      alert('Please upload an image before submitting.');
      return;
    }

    setLoading(true); // Show loading state

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCaption(data.caption); // Set the predicted caption
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'An error occurred.');
      }
    } catch (error) {
      alert('Error while uploading image:', error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    
    <div className=" flex flex-col items-center justify-center p-6 bg-gray-200 min-h-screen">

      <h1 className=" text-2xl md:text-6xl font-bold md:font-thin mb-6 text-yellow-700">
        Image Caption Generator 
      </h1>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-96 h-56 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-white mb-4"
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <p className="text-gray-500 text-center">
            Drag & Drop an image here <br /> or click "Browse" below
          </p>
        )}
      </div>

      {/* Browse Button */}
      <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mb-4">
        Browse Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md shadow-md"
      >
        {loading ? 'Submitting...' : 'Submit for Prediction'}
      </button>

      {/* Caption Display */}
      {caption && (
        <div className="mt-6 text-gray-700">
          <h2 className="text-lg font-semibold">Predicted Caption:</h2>
          <p>{caption}</p>
        </div>
      )}
    </div>
  );
}

export default App;
