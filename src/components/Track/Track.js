import React from 'react';
import PropTypes from 'prop-types';
import './Track.css';

function Track({ track }) {
  const { title, artist, album } = track;
  return (
    <li className="Track">
      <div className="details">
        <div className="title">{title}</div>
        <div className="artist">{artist}</div>
        <div className="album">{album}</div>
      </div>
    </li>
  );
}

Track.propTypes = {
  track: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Track;
