FROM node:20-slim AS base
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy build files
COPY . .
RUN npm run build

# Clean up development dependencies
RUN npm prune --production

EXPOSE 3000
CMD ["npm", "run", "start"]