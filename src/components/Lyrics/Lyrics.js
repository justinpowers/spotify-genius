import React from 'react';
import PropTypes from 'prop-types';
import './Lyrics.css';

function Lyrics({ lyrics }) {
  return <div className="Lyrics">{lyrics}</div>;
}

Lyrics.propTypes = {
  lyrics: PropTypes.string.isRequired,
};

export default Lyrics;
