import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-20 bg-gray-50 border-r border-gray-100 min-h-[640px] flex flex-col items-center py-6">
      <button className="mb-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">+</button>

      <div className="mt-auto mb-6 space-y-4">
        <button className="p-2 rounded-full hover:bg-gray-100">⟳</button>
        <button className="p-2 rounded-full hover:bg-gray-100">⚙</button>
      </div>
    </aside>
  );
};

export default Sidebar;

