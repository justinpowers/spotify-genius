import React from 'react';
import { render } from '@testing-library/react';
import SearchResults from './SearchResults';

test('renders search results', () => {
  const searchResults = [
    {
      id: 0,
      title: 'Another Love Song',
      artist: 'Sappy Sammy',
      album: 'Songs to Die For',
    },
    {
      id: 1,
      title: 'Sports! Sports! Sports!',
      artist: 'Long-Haired Lars',
      album: 'Selling Out',
    },
    {
      id: 2,
      title: 'My Country',
      artist: 'Tommy Twang',
      album: 'I Lost My...',
    },
  ];
  const { getByText } = render(<SearchResults searchResults={searchResults} />);

  const searchResultsHeader = getByText(/Search Results/);
  expect(searchResultsHeader).toBeInTheDocument();
});
