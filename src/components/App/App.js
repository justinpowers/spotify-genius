import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';

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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Genius!!!</h1>
      </header>
      <main>
        <SearchBar />
        <div className="SearchResults">
          <h2>Search Results</h2>
          <ul className="TrackList">
            {searchResults.map((track) => (
              <li key={track.id}>
                &quot;{track.title}&quot; - {track.artist}, <i>{track.album}</i>
              </li>
            ))}
          </ul>
        </div>
        <div className="Playlist">
          <h2>Playlist In Progress</h2>
          <ul className="TrackList">
            {playlistTracks.map((track) => (
              <li key={track.id}>
                &quot;{track.title}&quot; - {track.artist}, <i>{track.album}</i>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer />
    </div>
  );
}

export default App;
