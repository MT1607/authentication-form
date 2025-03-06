FROM node:18 AS base

# install dependencies
FROM base AS dept
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# build
FROM base AS builder
WORKDIR /app
COPY --from=dept /app/node_modules ./node_modules
COPY . .

# build project
RUN yarn build

# run production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# copy file build from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# open port 3000
EXPOSE 3000

# env for app
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# run server standalone
CMD ["node", "server.js"]