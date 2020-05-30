import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => setSearchTerm(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
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

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
