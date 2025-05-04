# Use official Node.js base image
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Install dependencies (only prod)
# COPY package*.json ./
# RUN npm ci --omit=dev  # installs only prod deps

# # Copy Prisma schema first (to cache layer)
# COPY prisma ./prisma
# RUN npx prisma generate

# # Copy rest of the code
# COPY . .

# # Build TypeScript
# RUN npm run build

# # Expose app port
# EXPOSE 4000

# # Start the app
# # CMD ["node", "dist/app.js"]
# CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run build && npm run start"]





# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci --omit=dev

# COPY prisma ./prisma
# COPY . .

# # Build TypeScript during image build
# RUN npm run build

# EXPOSE 4000

# # Apply migrations, regenerate Prisma client, then start app
# CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run start"]




# -------- STAGE 1: Build Stage --------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files to install all deps (including dev)
COPY package*.json ./
RUN npm ci

# Copy required project files
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY database ./database

# Generate Prisma client and build TypeScript
RUN npm run generate
RUN npm run build


# -------- STAGE 2: Production Stage --------
FROM node:18-alpine AS production

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built output and required runtime files from build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/database ./database
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expose app port
EXPOSE 4000

# Run migrations and start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
    


