import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { server } from './tests/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close()); 