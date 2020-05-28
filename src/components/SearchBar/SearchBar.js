import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => setSearchTerm(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm && searchTerm !== '') {
      console.log(`Searching for: ${searchTerm}`);
    }
  };

  return (
    <form className="SearchBar" onSubmit={handleSubmit}>
      <input
        type="text"
        aria-label="lyrics-search-input"
        placeholder="Search lyrics..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button className="SearchButton" type="submit">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
