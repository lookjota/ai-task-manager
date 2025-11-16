# syntax = docker/dockerfile:1

FROM node:20-slim as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build application
# Generate Prisma client for the build environment (creates ~/app/generated/prisma)
ENV DATABASE_URL="file:./database/database.sqlite"
# Force regenerate with cache bust to ensure latest schema is used
RUN rm -rf app/generated/prisma
RUN npx prisma generate || true
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Runtime stage
FROM node:20-slim as runtime

# Install OpenSSL (required by Prisma for database connections)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built assets and production dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
# Copy generated Prisma client (includes Query Engine binaries needed at runtime)
COPY --from=builder /app/app/generated/prisma ./app/generated/prisma
COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=3000
# Note: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN should be set via Render environment variables

EXPOSE 3000

CMD ["npm", "run", "start"]