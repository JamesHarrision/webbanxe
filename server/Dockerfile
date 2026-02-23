# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm install
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run build

# Remove development dependencies to keep stage 2 light
RUN npm prune --production

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./

# Set permissions for entrypoint
RUN chmod +x docker-entrypoint.sh

# Environment variables
ENV NODE_ENV=production

# Expose backend port
EXPOSE 6868

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
