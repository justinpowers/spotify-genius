import React, { useState } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import searchGenius from '../../utils/genius';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const search = async (searchTerm) => {
    let results = [];
    if (searchTerm && searchTerm !== '') {
      results = await searchGenius(searchTerm);
    }
    setSearchResults(results);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Genius!!!</h1>
      </header>
      <main>
        <SearchBar onSearch={search} />
        <SearchResults searchResults={searchResults} />
        <Playlist playlistTracks={playlistTracks} />
      </main>
      <footer />
    </div>
  );
}

export default App;
