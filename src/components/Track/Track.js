import React from 'react';
import PropTypes from 'prop-types';
import './Track.css';
import defaultImage from './64x64_empty.png';

function Track({ track }) {
  const { title, artist, album, image, releaseDate } =
    track.spotify[0] || track;
  const releaseYear = releaseDate ? releaseDate.slice(0, 4) : '';
  return (
    <li className="Track">
      <div className="Art">
        <img src={image || defaultImage} alt="track art" />
      </div>
      <div className="Details">
        <div className="Title">{title}</div>
        <div className="Artist">{artist}</div>
        <div className="AlbumAndYear">
          {album}, {releaseYear}
        </div>
      </div>
    </li>
  );
}

Track.propTypes = {
  track: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Track;
