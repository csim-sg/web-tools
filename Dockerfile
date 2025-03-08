# Base stage for dependencies
FROM node:20-alpine AS deps
WORKDIR /app
ENV PYTHONUNBUFFERED 1
RUN apk add --update --no-cache python3 py3-pip && ln -sf python3 /usr/bin/python
RUN pip3 install --no-cache --upgrade --break-system-packages pip setuptools
COPY package.json package-lock.json ./
RUN npm ci

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
ENV PYTHONUNBUFFERED 1
RUN apk add --update --no-cache python3 py3-pip && ln -sf python3 /usr/bin/python
RUN pip3 install --no-cache --upgrade --break-system-packages pip setuptools
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PYTHONUNBUFFERED 1
RUN apk add --update --no-cache python3 py3-pip && ln -sf python3 /usr/bin/python
RUN pip3 install --no-cache --upgrade --break-system-packages pip setuptools

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 