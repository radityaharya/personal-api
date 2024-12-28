# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun build --target bun --compile --minify --smol --sourcemap --outfile personal-api ./src/server.ts

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app/personal-api ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD ["/app/personal-api", "--health-check"] || exit 1


CMD ["./personal-api"]