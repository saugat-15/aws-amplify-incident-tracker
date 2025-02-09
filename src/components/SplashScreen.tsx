import { useState, useEffect } from "react";

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3.333; // Increase by ~3.33% every 100ms to complete in 3 seconds
      });
    }, 100);

    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#2C3930] z-50">
      {/* Logo or company name */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#e3fcd6]">
          Service Request Incident Tracker
        </h1>
        <h3 className="text-xl font-bold text-center text-[#A27B5C] mt-2">
          Welcome !!
        </h3>
      </div>

      {/* Progress bar container */}
      <div className="w-64 h-2 bg-[#3F4F44] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#A27B5C] transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
