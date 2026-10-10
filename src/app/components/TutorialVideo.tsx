import React, { useState, useEffect } from "react";

const TutorialVideo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("tutorial_seen");
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("tutorial_seen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">LabourMatch kaise use karein</h2>
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src="/tutorial.html"
              title="LabourMatch Tutorial"
              frameBorder="0"
              allowFullScreen
            />
          </div>
          <button
            onClick={handleClose}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
          >
            Samajh gaya, shuru karein ?
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialVideo;
