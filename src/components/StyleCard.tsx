import React from "react";

export const StyleCard = () => {
  return (
    <div className="bg-card rounded-2xl shadow-lg p-3 flex flex-col items-center min-w-[140px] max-w-[160px] min-h-[210px] transition-transform hover:scale-105 hover:shadow-xl duration-200 border border-primary/10 cursor-pointer">
      <div className="w-28 h-36 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-lg mb-2 shadow relative overflow-hidden flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=160&q=80"
          alt="Style Example"
          className="w-full h-full object-cover object-center transition-transform duration-300"
          loading="eager"
          style={{ aspectRatio: "4 / 5" }}
        />
      </div>
      <h3 className="text-base font-bold text-white text-center cursor-pointer">Style Name</h3>
    </div>
  );
};
