import React from 'react';
import TopBar from './TopBar';
import SearchBar from './SearchBar';
import SideBar from './SideBar';

const App = () => {
  return (
    <div className="app">
      <TopBar />
      <SearchBar />
      <div className="content">
        <SideBar />
        {/* Add main content here */}
      </div>
    </div>
  );
};

export default App;
