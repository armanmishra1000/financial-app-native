const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add src folder to the watch folders
config.watchFolders = [__dirname];

// Add the src folder to the module resolution
config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  './node_modules',
];

// Add the alias resolution
config.resolver.alias = {
  '@': './src',
};

module.exports = config;
