const genius = require('./genius');
const spotify = require('./spotify');

// parses into individual words and double-quoted bound phrases
const parsedSearchInput = {};
function parseSearchInput(searchInput) {
  if (!parsedSearchInput[searchInput]) {
    console.log('Parsing search input: ', searchInput);
    let terms = searchInput.match(
      /(?<=^|\s)"[^"]+"(?=\s|$)|(?<=^|\s)[^\s]+(?=\s|$)/g
    );
    terms = terms.map((term) =>
      term.includes(' ') ? term.replace(/^"|"$/g, '') : term
    );
    parsedSearchInput[searchInput] = terms;
    console.log('Parsed search input: ', parsedSearchInput[searchInput]);

    // delete entry from cache to free storage
    setTimeout(() => {
      console.log('Deleting parsed search input from cache: ', searchInput);
      delete parsedSearchInput[searchInput];
    }, 60 * 1000);
  }
  return parsedSearchInput[searchInput];
}

// Honors phrasal searches denoted by double-quote bounded phrases
// case-insensitive unless it is a phrasal search
// As currently implemented, punctuation should be honored, including
// double quotes within a set of double quotes. But this is not guaranteed
//
// The return value is the ratio of matching search terms to total search
// terms, this is not total occurrences but simply boolean matches. This
// will allow some degree of relevance sorting. I may later TODO: add a count
// of match occurrences.
//
// Search currently does not consider word boundaries. A match can occur
// within a word. TODO: Word boundaries will eventually be honored.
function searchWithinLyrics(searchInput, lyrics) {
  const terms = parseSearchInput(searchInput);

  let containsTerms = 0;
  terms.forEach((term) => {
    if (
      (term.includes(' ') && lyrics.includes(term)) ||
      lyrics.toLowerCase().includes(term.toLowerCase())
    ) {
      containsTerms += 1;
    }
  });
  return containsTerms / terms.length;
}

async function getTracks(params) {
  const searchTerm = params.get('lyrics');

  if (!params.has('lyrics')) {
    throw new Error('Missing query parameter');
  }

  const geniusResults = await genius.queryAPI(searchTerm);

  const geniusTracks = (
    await Promise.all(
      geniusResults
        .filter(({ lyricsState }) => lyricsState === 'complete')
        .map(async (result) => {
          const { url } = result;
          const lyrics = await genius.getLyrics(url);
          const album = await genius.getAlbum(url);
          const spotifyId = await genius.getSpotifyId(url);
          const primaryTag = await genius.getPrimaryTag(url);
          const matchRatio = searchWithinLyrics(searchTerm, lyrics);
          return {
            ...result,
            album,
            lyrics,
            matchRatio,
            spotifyId,
            primaryTag,
          };
        })
    )
  )
    .filter(
      ({ matchRatio, primaryTag }) =>
        matchRatio > 0 && primaryTag != 'non-music'
    )
    .sort((a, b) => b.matchRatio - a.matchRatio);

  // collect spotifyIds above
  // submit array of ids to spotify getTracks function
  //   the result should be mapped to an object using the same-ordered spotifyId array and using that id as the property
  const spotifyIds = geniusTracks.flatMap(({ spotifyId }) =>
    spotifyId ? [spotifyId] : []
  );

  const spotifyTracksById =
    spotifyIds.length > 0 ? await spotify.getTracksById(spotifyIds) : {};

  let spotifyTracks = [];
  const tracks = (
    await Promise.all(
      geniusTracks.map(async (geniusTrack, index) => {
        if (geniusTrack.spotifyId) {
          spotifyTracks = [spotifyTracksById[geniusTrack.spotifyId]];
          // add track to an array that will be sent as one request
          // the response will contain the requested tracks in the same order
          // as sent in the request, with nulls for unfound tracks.
          // utilize this to quickly match up the tracks
        } else {
          spotifyTracks = await spotify.queryAPI(geniusTrack);
          //  if (spotifyTracks.length === 0) {
          // remove album from query
          // spotifyTracks = await spotify.queryAPI(geniusTrack w/o album);
          //  }
        }
        return {
          ...{ id: index },
          genius: geniusTrack,
          spotify: spotifyTracks,
        };
      })
    )
  ).filter(({ spotify }) => spotify.length > 0);

  console.log('tracks: ', tracks);
  // TODO: filter for best match
  // TODO: restructure for return to display

  return tracks;
}

exports.getTracks = getTracks;
