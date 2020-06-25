const genius = require('./genius');

async function getSongs(params) {
  return genius.queryGeniusAPI(params.get('lyrics'));
}

exports.getSongs = getSongs;
