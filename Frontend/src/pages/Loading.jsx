import { useEffect, useState } from "react";

const PlantLoader = () => {
  const [grow, setGrow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrow(false);
      setTimeout(() => setGrow(true), 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      
      {/* Plant */}
      <div className="relative w-20 h-40">
        
        {/* Stem */}
        <div
          className={`absolute bottom-10 left-1/2 w-1.5 bg-green-800 origin-bottom 
          transition-all duration-1000 ease-out
          ${grow ? "h-24" : "h-0"}`}
          style={{ transform: "translateX(-50%)" }}
        />

        {/* Left Leaf */}
        <div
          className={`absolute left-1 top-16 w-6 h-3 bg-green-500 rounded-full 
          transition-all duration-700 delay-500
          ${grow ? "opacity-100 scale-100" : "opacity-0 scale-0"}
          rotate-[-30deg]`}
        />

        {/* Right Leaf */}
        <div
          className={`absolute right-1 top-12 w-6 h-3 bg-green-500 rounded-full 
          transition-all duration-700 delay-700
          ${grow ? "opacity-100 scale-100" : "opacity-0 scale-0"}
          rotate-[30deg]`}
        />

        {/* Pot */}
        <div className="absolute bottom-0 w-full h-10 bg-amber-900 rounded-b-xl" />
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-green-900 font-medium animate-pulse">
        Growing...
      </p>
    </div>
  );
};

export default PlantLoader;
