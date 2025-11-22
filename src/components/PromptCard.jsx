import React from "react";

const PromptCard = ({ text }) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition-all cursor-pointer text-center"
    >
      <p className="text-gray-800 font-medium">{text}</p>
    </div>
  );
};

export default PromptCard;

