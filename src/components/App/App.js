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
      const serverIP =
        process.env.NODE_ENV === 'production'
          ? process.env.REACT_APP_PROD_SERVER
          : process.env.REACT_APP_PROXY_URL;
      const url = new URL(`http://${serverIP}`);
      url.pathname = '/spotify-talks-to-a-genius/tracks';
      url.searchParams.set('lyrics', searchTerm);
      try {
        console.log(url);
        const response = await fetch(url);
        results = await response.json();
      } catch (e) {
        console.log('Failed to fetch: ', url, e);
      }
    }
    setSearchResults(results);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Talks to a Genius</h1>
      </header>
      <main>
        <SearchBar onSearch={search} />
        <SearchResults searchResults={searchResults} />
        {/* <Playlist playlistTracks={playlistTracks} /> */}
      </main>
      <footer />
    </div>
  );
}

export default App;
