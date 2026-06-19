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

# Hugging Face Spaces requires port 7860
EXPOSE 7860

ENV PORT=7860
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
