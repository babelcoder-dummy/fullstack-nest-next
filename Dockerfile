FROM node:22.3.0-alpine3.19 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN npx prisma generate && pnpm build

FROM node:22.3.0-alpine3.19
COPY --from=builder /app/node_modules ./app/node_modules
COPY --from=builder /app/dist ./app/dist
CMD [ "node", "dist/src/main.js" ]