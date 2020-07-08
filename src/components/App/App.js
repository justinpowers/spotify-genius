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
      let url;
      if (process.env.NODE_ENV === 'production') {
        url = new URL(`http://${process.env.REACT_APP_PROD_SERVER}`);
      } else {
        url = new URL(`http://${process.env.REACT_APP_PROXY_URL}`);
      }
      url.pathname = '/spotify-talks-to-a-genius/tracks';
      url.searchParams.set('lyrics', searchTerm);
      console.log(url);
      try {
        const response = await fetch(url);
        results = await response.json();
      } catch (error) {
        console.log('***This is the error: ', error);
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
