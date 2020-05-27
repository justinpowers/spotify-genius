import React from 'react';
import { render } from '@testing-library/react';
import SearchBar from './SearchBar';

test('render search bar', () => {
  const { getByPlaceholderText, getByRole } = render(<SearchBar />);

  const searchField = getByPlaceholderText(/Search lyrics.../);
  expect(searchField).toBeInTheDocument();

  const searchButton = getByRole('button');
  expect(searchButton).toBeInTheDocument();
});
