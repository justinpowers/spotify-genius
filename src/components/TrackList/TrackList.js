import React from 'react';
import PropTypes from 'prop-types';
import './TrackList.css';
import Track from '../Track/Track';

function TrackList({ tracks }) {
  const trackList = tracks.map((track) => (
    <Track key={track.id.toString()} track={track} />
  ));
  return <ul className="TrackList">{trackList}</ul>;
}

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TrackList;
