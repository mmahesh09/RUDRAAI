FROM node:20-alpine

WORKDIR /app

# Install dependencies (including devDeps needed for TypeScript build)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
