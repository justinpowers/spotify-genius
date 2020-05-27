import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders essential structure of spotify genius', () => {
  const { getByText, getByPlaceholderText } = render(<App />);

  const titleHeader = getByText(/Spotify Genius!!!/);
  expect(titleHeader).toBeInTheDocument();

  const searchField = getByPlaceholderText(/Search lyrics.../);
  expect(searchField).toBeInTheDocument();

  const searchButton = screen.getByRole('button');
  expect(searchButton).toBeInTheDocument();

  const searchResultsHeader = getByText(/Search Results/);
  expect(searchResultsHeader).toBeInTheDocument();

  const playlistInProgressHeader = getByText(/Playlist In Progress/);
  expect(playlistInProgressHeader).toBeInTheDocument();
});
