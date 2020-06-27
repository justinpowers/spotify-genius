const genius = require('./genius');

async function getTracks(params) {
  // let tracks = [];
  // let element;
  const searchTerm = params.get('lyrics');
  let geniusCandidates;

  // get genius results
  if (params.has('lyrics')) {
    const geniusQueryResults = await genius.queryAPI(searchTerm);
    geniusCandidates = await Promise.all(
      geniusQueryResults.map(
        async ({
          result: {
            id,
            title,
            url,
            primary_artist: { name: artist },
          },
        }) => {
          const [album, lyrics] = await genius.scrapeHTML(url);
          // Currently returns true only on case-INsensitive EXACT matches.
          //   If the search term is wrapped in double-quotes, then it
          //   simply (albeit counterintuitively) searches for the same
          //   double-quotes within the lyrics. Likewise, it will not match
          //   across new-lines and other white space. And it currently
          //   does not consider word boundaries. Meaning it will match
          //   within a word. Much of this will change in future iterations.
          const hasLyricMatch = lyrics
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          return {
            id,
            title,
            artist,
            album,
            url,
            lyrics,
            hasLyricMatch,
          };
        }
      )
    );

    // TODO: search spotify on filtered genius results
    // TODO: filter for best match
    // TODO: restructure for return to display
  }

  geniusCandidates.forEach((gC) =>
    console.log(
      '[%s] #%s:\t%s - %s\nalbum: %s',
      gC.hasLyricMatch,
      gC.id,
      gC.title,
      gC.artist,
      gC.album,
    )
  );
  return geniusCandidates.filter(
    (candidate) => candidate.hasLyricMatch === true
  );
}

exports.getTracks = getTracks;
