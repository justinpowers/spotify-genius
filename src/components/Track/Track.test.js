import React from 'react';
import { render } from '@testing-library/react';
import Track from './Track';

test('renders a track listing', () => {
  const track = {
    id: 1,
    title: 'track title',
    artist: 'track artist',
    album: 'track album',
  };
  const { getByText } = render(
    <Track key={track.id.toString()} track={track} />
  );

  const trackListing = getByText(/"track title" - track artist,/);
  expect(trackListing).toBeInTheDocument();
});
