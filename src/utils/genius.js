async function submitGeniusAPIRequest(endpoint, params = []) {
  const url = new URL('https://api.genius.com');
  url.pathname = endpoint;
  url.searchParams.set('access_token', tkn);
  params.forEach((value, key) => url.searchParams.set(key, value));
  let response = {};
  try {
    response = await fetch(url);
    response = await response.json();
  } catch (error) {
    console.log(error);
  }
  return response;
}

async function getAlbum(songID) {
  const endpoint = `/songs/${songID}`;
  let album = '';
  try {
    const JSONresponse = await submitGeniusAPIRequest(endpoint);
    album = JSONresponse.response.song.album.name;
  } catch (error) {
    console.log(error);
  }
  return album;
}

// scrape the website for lyrics to determine if the search results
//   were accurate. Genius likes to return matches where the match
//   is of an artist or title, and the lyrics have no match. This is
//   not what i want.
async function getLyrics() {
}

async function searchGenius(searchTerm) {
  const endpoint = '/search';
  const params = new Map([['q', searchTerm]]);
  const JSONresponse = await submitGeniusAPIRequest(endpoint, params);
  let results = [];
  try {
    if (JSONresponse.response.hits.length > 0) {
      results = await Promise.all(
        JSONresponse.response.hits.map(async (hit) => ({
          id: hit.result.id,
          title: hit.result.title,
          artist: hit.result.primary_artist.name,
          album: await getAlbum(hit.result.id),
        }))
      );
    }
  } catch (error) {
    console.log(error);
  }
  return results;
}

// why am i exposing this? because I don't want to concern myself with server-
// side code for this app. I want a quick and not-quite-squeaky-clean SPA. I
// expect users to sign up for a Genius account simply to test this out.
// I actually don't expect many actualy users in general, only sight-seers.
// More importantly, this token can only access read-only endpoints; any misuse
// would be relatively innocuous. At worst, the app would get shutdown
// sooner than I intended, which is as soon as it serves proof of life :)
const tkn = 'hbWSKeqvFI_XYyPGwwDNsAplq68KYMYYNTsSaW0exP_7Qwfp4kd4okYAqe4YY6c9';

export default searchGenius;
