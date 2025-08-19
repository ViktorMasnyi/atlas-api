FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install pnpm with a specific version that's compatible with the lockfile
RUN npm install -g pnpm@8.15.0
RUN pnpm install --frozen-lockfile

COPY . .

# Build the application with verbose output
RUN pnpm build
RUN ls -la dist/

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]


