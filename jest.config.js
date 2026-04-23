module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-worklets|react-native-.*)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
