import React from 'react';
import { render } from '@testing-library/react';
import Playlist from './Playlist';

test('renders playlist', () => {
  const playlistTracks = [
    {
      id: 3,
      title: 'Hippity Hop',
      artist: 'Lil B.I.G.',
      album: 'Beats and More Beats',
    },
    {
      id: 4,
      title: 'Loopy Lullabies',
      artist: 'Icelandic Idaho',
      album: 'Air Conditioners and Other Sounds',
    },
  ];
  const { getByText } = render(<Playlist playlistTracks={playlistTracks} />);

  const playlistInProgressHeader = getByText(/Playlist In Progress/);
  expect(playlistInProgressHeader).toBeInTheDocument();
});
