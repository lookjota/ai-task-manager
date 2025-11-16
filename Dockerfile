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
RUN npx prisma generate || true
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Runtime stage
FROM node:20-slim as runtime

WORKDIR /app

# Copy built assets and production dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"]