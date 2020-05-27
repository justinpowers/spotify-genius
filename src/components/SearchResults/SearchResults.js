import React from 'react';
import PropTypes from 'prop-types';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

function SearchResults({ searchResults }) {
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      <TrackList trackList={searchResults} />
    </div>
  );
}

SearchResults.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SearchResults;
