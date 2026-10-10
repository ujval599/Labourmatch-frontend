import React, { useState, useEffect } from "react";

const TutorialVideo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("tutorial_seen");
    if (!seen) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    localStorage.setItem("tutorial_seen", "true");
  };

  if (!isVisible || isClosed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 shadow-2xl rounded-xl overflow-hidden" style={{ width: "320px" }}>
      <div className="bg-gray-900 flex items-center justify-between px-3 py-2">
        <span className="text-white text-sm font-medium">?? LabourMatch kaise use karein</span>
        <button onClick={handleClose} className="text-gray-400 hover:text-white text-lg leading-none">?</button>
      </div>
      <div style={{ height: "180px" }}>
        <iframe
          src="/tutorial.html"
          title="LabourMatch Tutorial"
          frameBorder="0"
          width="100%"
          height="100%"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default TutorialVideo;
