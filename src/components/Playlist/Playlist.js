import React from 'react';
import PropTypes from 'prop-types';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

function Playlist({ playlistTracks }) {
  return (
    <div className="Playlist">
      <h2>Playlist In Progress</h2>
      <TrackList trackList={playlistTracks} />
    </div>
  );
}

Playlist.propTypes = {
  playlistTracks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Playlist;
