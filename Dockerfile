# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun build --target bun --compile --minify --smol --sourcemap --outfile personal-api ./src/index.ts

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app/personal-api ./

EXPOSE 3000

CMD ["./personal-api"]