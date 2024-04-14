import React from 'react';

const SideBar = () => {
  return (
    <div className="side-bar">
      <input type="text" placeholder="Search..." />
      <select>
        <option value="">Filter</option>
        {/* Add filter options here */}
      </select>
    </div>
  );
};

export default SideBar;
