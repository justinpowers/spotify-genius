import React, { useState } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const search = async (searchTerm) => {
    let results = [];
    if (searchTerm) {
      const url = new URL(`http://${process.env.REACT_APP_PROXY_URL}`);
      url.pathname = '/tracks';
      url.searchParams.set('lyrics', searchTerm);
      console.log(url);
      try {
        const response = await fetch(url);
        results = await response.json();
      } catch (error) {
        console.log(error);
      }
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
