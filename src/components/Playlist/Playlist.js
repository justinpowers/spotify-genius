import React from 'react';
import PropTypes from 'prop-types';
import './Playlist.css';

function Playlist({ playlistTracks }) {
  return (
    <div className="Playlist">
      <h2>Playlist In Progress</h2>
      <ul className="TrackList">
        {playlistTracks.map((track) => (
          <li key={track.id}>
            &quot;{track.title}&quot; - {track.artist}, <i>{track.album}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}

Playlist.propTypes = {
  playlistTracks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Playlist;
