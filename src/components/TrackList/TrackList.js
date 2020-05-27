import React from 'react';
import PropTypes from 'prop-types';
import './TrackList.css';

function TrackList({ trackList }) {
  return (
    <ul className="TrackList">
      {trackList.map((track) => (
        <li key={track.id}>
          &quot;{track.title}&quot; - {track.artist}, <i>{track.album}</i>
        </li>
      ))}
    </ul>
  );
}

TrackList.propTypes = {
  trackList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TrackList;
