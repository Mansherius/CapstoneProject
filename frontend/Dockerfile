# Use official Node.js 22 image with Alpine for smaller size
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy rest of the app
COPY . .

# Set environment variable
ENV NODE_ENV=production


# Build the Next.js app
RUN npm run build

# ------------------------
# Production stage
# ------------------------
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the necessary output from build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
