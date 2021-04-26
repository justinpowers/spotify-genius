import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Track.css';
import Lyrics from '../Lyrics/Lyrics';
import defaultImage from './64x64_empty.png';

function Track({ track }) {
  const [displayLyrics, setDisplayLyrics] = useState(false);

  const { title, artist, album, image, releaseDate } =
    track.spotify[0] || track.genius;
  const { lyrics } = track.genius;
  const releaseYear = releaseDate ? releaseDate.slice(0, 4) : '';
  console.log(track);

  /*
  function toggleDisplayLyrics() {
    if (!displayLyrics) {
      setDisplayLyrics(true);
    } else {
      setDisplayLyrics(false);
    }
  }
  */

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
        <button
          onClick={() => setDisplayLyrics((displayLyrics) => !displayLyrics)}
        >
          Lyrics
        </button>
        {displayLyrics && <Lyrics lyrics={lyrics} />}
      </div>
    </li>
  );
}

Track.propTypes = {
  track: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Track;
