# ----------------------------------------
# Stage 1 Builder Stage
# ----------------------------------------
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package*.json files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the app
RUN npm run build

# ----------------------------------------
# Stage 2 Production Stage
# ----------------------------------------

FROM node:18

# Set Working directory
WORKDIR /app

# Copy package*.json files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the built app from Stage 1
# npm run build puts the build files in he next directory
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the listening port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]