FROM node:18-slim

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install && pnpm add esbuild -D

COPY . .

EXPOSE 5173

CMD ["pnpm", "dev"]
