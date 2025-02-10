import * as React from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Simplified CircularProgressWithLabel component
function CircularProgressWithLabel({ value }: { value: number }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        sx={{ color: "#A27B5C" }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" sx={{ color: "#e3fcd6" }}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const SplashScreen = () => {
  const [progress, setProgress] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // Reduced to 2 seconds
    const interval = 16;

    const progressInterval = setInterval(() => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      setProgress(progress * 100);

      if (progress >= 1) {
        clearInterval(progressInterval);
        setTimeout(() => navigate("/dashboard"), 300);
      }
    }, interval);

    return () => clearInterval(progressInterval);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#2C3930] z-50">
      <div
        className={`mb-8 ${
          progress > 20 ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      >
        <h1 className="text-lg md:text-4xl font-bold text-[#e3fcd6] text-center">
          Service Request Incident Tracker
        </h1>
        <h3 className="text-xl font-bold text-center text-[#A27B5C] mt-2">
          Welcome !!
        </h3>
      </div>

      <CircularProgressWithLabel value={progress} />

      <p className="mt-4 text-[#e3fcd6] text-sm opacity-60">Loading...</p>
    </div>
  );
};

export default SplashScreen;
