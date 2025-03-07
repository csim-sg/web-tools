import { rest } from 'msw';
import { env } from '@/config/env';

export const handlers = [
  // Currency API
  rest.get(`${env.api.exchangeRate}/latest/:base`, (req, res, ctx) => {
    return res(
      ctx.json({
        base: 'USD',
        rates: {
          EUR: 0.85,
          GBP: 0.73,
        },
      })
    );
  }),

  // Image Processing API
  rest.post('/api/image/convert', async (req, res, ctx) => {
    return res(
      ctx.set('Content-Type', 'image/jpeg'),
      ctx.body(new Blob())
    );
  }),

  // PDF API
  rest.post('/api/convert/pdf-to-word', async (req, res, ctx) => {
    return res(
      ctx.set('Content-Type', 'application/docx'),
      ctx.body(new Blob())
    );
  }),

  // ... add more API mocks as needed
]; 