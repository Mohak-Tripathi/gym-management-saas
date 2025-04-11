# # # Use official Node.js image
# # FROM node:18-alpine

# # # Set working directory
# # WORKDIR /app

# # # Install dependencies
# # COPY package.json package-lock.json ./
# # RUN npm install

# # # Copy the rest of the app
# # COPY . .

# # # Build the TypeScript code
# # RUN npm run build

# # # Start the server
# # CMD ["node", "dist/app.js"]



# # Base image
# FROM node:18-alpine

# # Create app directory
# WORKDIR /app

# # Install app dependencies
# COPY package*.json ./
# RUN npm install

# # Copy source code
# COPY . .

# # 👇 this should come AFTER copying schema.prisma
# RUN npx prisma generate

# # Build TypeScript (assumes "build" script is in package.json)
# RUN npm run build

# # Expose port
# EXPOSE 4000

# # Start app
# CMD ["npm", "run", "start"]



# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (helps with Docker layer caching)
COPY package*.json ./
RUN npm install

# Copy Prisma schema BEFORE generating client
COPY prisma ./prisma

# Generate Prisma client (this will put it in node_modules)
RUN npx prisma generate

# Copy remaining source code (including tsconfig, src, etc.)
COPY . .

# Build TypeScript to dist/
RUN npm run build

# Expose app port
EXPOSE 4000

# Start the app
CMD ["node", "dist/app.js"]
