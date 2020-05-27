import React from 'react';
import PropTypes from 'prop-types';
import './Track.css';

function Track({ track }) {
  return (
    <li>
      &quot;{track.title}&quot; - {track.artist}, <i>{track.album}</i>
    </li>
  );
}

Track.propTypes = {
  track: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Track;
