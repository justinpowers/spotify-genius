import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('initial display of App', () => {
  let screen;

  beforeEach(() => {
    screen = render(<App />);
  });

  test('for display of title header', () => {
    const titleHeader = screen.getByText(/Spotify Genius!!!/);
    expect(titleHeader).toBeInTheDocument();
  });

  test('for presence of SearchBar elements', () => {
    const inputHint = screen.getByPlaceholderText(/Search lyrics.../);
    expect(inputHint).toBeInTheDocument();

    const inputField = screen.getByLabelText('lyrics-search-input');
    expect(inputField.value).toBe('');

    const searchButton = screen.getByRole('button');
    expect(searchButton).toBeInTheDocument();
  });

  test('for presence SearchResults component', () => {
    const searchResultsHeader = screen.getByText(/Search Results/);
    expect(searchResultsHeader).toBeInTheDocument();
  });

  test('for presence of Playlist component', () => {
    const playlistInProgressHeader = screen.getByText(/Playlist In Progress/);
    expect(playlistInProgressHeader).toBeInTheDocument();
  });
});
