# Dependencies stage
FROM node:18.20-alpine AS deps

WORKDIR /app

# Install build essentials
RUN apk add --no-cache python3 make g++

# Enable pnpm with specific version
RUN corepack enable \
    && corepack prepare pnpm@10.6.2 --activate

# Copy package files and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY nuxt.config.ts ./

# Install dependencies and prepare Nuxt
RUN pnpm install
RUN pnpm nuxt prepare

RUN mkdir -p /app/cache && chmod 777 /app/cache

COPY . .

# Run nuxt prepare before build
RUN pnpm nuxt prepare

# Build application
RUN pnpm build

# Pour debug
# CMD ["tail", "-f", "/dev/null"]
CMD ["node", ".output/server/index.mjs"]
