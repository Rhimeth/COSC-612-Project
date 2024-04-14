import React from 'react';

const TopBar = () => {
    return (
        <div className="top-bar">
            <a href="/">Home</a>
            <a href="/favorites">Favorites</a>
            <input type="text" placeholder="Search..." />
        </div>
    );
};

export default TopBar;
  