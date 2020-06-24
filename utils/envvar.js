const fs = require('fs');
const os = require('os');
const path = require('path');

function readEnvFile(envPath) {
  return fs.readFileSync(envPath, { encoding: 'utf8' });
}

// Will only parse properties consisting of uppercase letters. Underscore is
//   acceptable in the interior of the property name. Propery and value must
//   be separated by a '=' without spaces unless the space is part of value.
//   Values may be anything including empty. And may contain '='.
function parseEnvData(data) {
  /* eslint-disable no-param-reassign */
  const parsedData = data.split(os.EOL).reduce((result, line) => {
    if (/^[A-Z][A-Z_]*[A-Z]=.*$/.test(line)) {
      const splitLine = line.split('=');
      // this will overwrite previous property in same env file (cascading)
      result[splitLine[0]] = splitLine.slice(1).join('=');
    }
    return result;
  }, {});
  /* eslint-enable no-param-reassign */
  return parsedData;
}

function setEnvVars(data) {
  for (const property in data) {
    if (!(property in process.env)) {
      process.env[property] = data[property];
    }
  }
}

function controller() {
  const envFile = '.env';
  const envDir = process.cwd();
  const envPath = path.resolve(envDir, envFile);
  try {
    const data = readEnvFile(envPath);
    const parsedData = parseEnvData(data);
    setEnvVars(parsedData);
    console.log(`Environment variables successfully loaded from ${envPath}`);
  } catch (e) {
    console.log(`Failed to load ${envPath} as environment variables.\n`, e);
  }
}

exports.load = controller;
