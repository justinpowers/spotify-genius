import React from 'react';
import PropTypes from 'prop-types';
import './TrackList.css';
import Track from '../Track/Track';

function TrackList({ trackList }) {
  return (
    <ul className="TrackList">
      {trackList.map((track) => (
        <Track key={track.id.toString()} track={track} />
      ))}
    </ul>
  );
}

TrackList.propTypes = {
  trackList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TrackList;
