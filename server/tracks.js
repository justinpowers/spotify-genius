const genius = require('./genius');
const spotify = require('./spotify');

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
function searchWithinLyrics(searchTerm, lyrics) {
  console.log(searchTerm);
  let terms = searchTerm.match(
    /(?<=^|\s)"[^"]+"(?=\s|$)|(?<=^|\s)[^\s]+(?=\s|$)/g
  );
  terms = terms.map((term) =>
    term.includes(' ') ? term.replace(/^"|"$/g, '') : term
  );
  console.log('Search terms: ', terms);

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
  let geniusPlusSpotifyCandidates;

  // get genius results
  if (params.has('lyrics')) {
    const geniusResults = await genius.queryAPI(searchTerm);

    const geniusResultsExpandedAndFiltered = (
      await Promise.all(
        geniusResults.map(async (result) => {
          const lyrics = await genius.getLyrics(result.url);
          const album = await genius.getAlbum(result.url);
          const matchRatio = searchWithinLyrics(searchTerm, lyrics);
          return Object.assign(result, { album, lyrics, matchRatio });
        })
      )
    ).filter((result) => result.matchRatio >= 0);

    geniusResultsExpandedAndFiltered.sort(
      (a, b) => b.matchRatio - a.matchRatio
    );

    geniusPlusSpotifyCandidates = await Promise.all(
      geniusResultsExpandedAndFiltered.map(async (geniusResult) => {
        const spotifyQueryResults = await spotify.queryAPI(geniusResult);
        return Object.assign(geniusResult, spotifyQueryResults);
      })
    );

    console.log(geniusPlusSpotifyCandidates);
    // TODO: filter for best match
    // TODO: restructure for return to display
  }

  return geniusPlusSpotifyCandidates;
}

exports.getTracks = getTracks;
