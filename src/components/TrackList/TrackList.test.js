import React from 'react';
import { render } from '@testing-library/react';
import TrackList from './TrackList';

test('renders a list of tracks', () => {
  const trackList = [
    {
      id: 1,
      title: 'track title',
      artist: 'track artist',
      album: 'track album',
    },
  ];
  const { getByText } = render(<TrackList trackList={trackList} />);

  const tracklisting = getByText(/"track title" - track artist,/);
  expect(tracklisting).toBeInTheDocument();
});
