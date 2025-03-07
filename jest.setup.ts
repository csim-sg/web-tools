import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Import MSW server after setting up the environment
import { server } from './tests/mocks/server';

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());

// Suppress console errors and warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning.*not wrapped in act/.test(args[0]) ||
      /Warning.*ReactDOM.render is no longer supported/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Add custom matchers
expect.extend({
  toHaveBeenCalledOnceWith(received, ...expected) {
    const pass = 
      received.mock.calls.length === 1 &&
      JSON.stringify(received.mock.calls[0]) === JSON.stringify(expected);
    
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received.mock.calls} not to have been called once with ${expected}`
          : `Expected ${received.mock.calls} to have been called once with ${expected}`,
    };
  },
}); 