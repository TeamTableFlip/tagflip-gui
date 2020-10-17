let ld = require('lodash');

let defaultConfig = require('./default.json');
let environment = process.env.NODE_ENV || 'development';
let environmentConfig = require('./' + environment + '.json');
let config = ld.merge(defaultConfig, environmentConfig);

console.info("TODO: parsing system environment configuration");
//TODO add support for Configuration via system environment aka command line arguments
// so something like this: config.port = process.env.port || config.port;

let localConfig = {};
try {
    localConfig = require('./local.json');
    console.info("local config found, merging configs (overwriting env vars!)");
} catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
        console.info("No local config.");
    }

}

config = ld.merge(config, localConfig);

console.debug(`using config: ${JSON.stringify(config)}`);
module.exports = config;
