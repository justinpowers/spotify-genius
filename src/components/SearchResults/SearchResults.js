import React from 'react';
import PropTypes from 'prop-types';
import './SearchResults.css';

function SearchResults({ searchResults }) {
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      <ul className="TrackList">
        {searchResults.map((track) => (
          <li key={track.id}>
            &quot;{track.title}&quot; - {track.artist}, <i>{track.album}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}

SearchResults.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SearchResults;
