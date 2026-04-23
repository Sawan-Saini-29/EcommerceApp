let store = {};

module.exports = {
  setItem: jest.fn(async (key, value) => {
    store[key] = String(value);
    return Promise.resolve(value);
  }),
  getItem: jest.fn(async (key) => Promise.resolve(store[key] ?? null)),
  removeItem: jest.fn(async (key) => {
    delete store[key];
    return Promise.resolve();
  }),
  clear: jest.fn(async () => {
    store = {};
    return Promise.resolve();
  }),
  __esModule: true,
};
