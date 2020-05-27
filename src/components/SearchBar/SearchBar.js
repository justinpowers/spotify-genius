import React from 'react';
import './SearchBar.css';

function SearchBar() {
  return (
    <div className="SearchBar">
      <input type="text" placeholder="Search lyrics..." />
      <button className="SearchButton" type="button">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
