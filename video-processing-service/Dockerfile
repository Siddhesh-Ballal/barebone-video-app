# Stage 1: Build stage
# Build Dockerfile on top of Node.js 18 image (Which itself is a docker image)
FROM node:18 AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the docker image
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run/ Production stage
FROM node:18

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from the builder stage (Stage 1)
COPY --from=builder /app/dist ./dist
# This copies the compiled files from the builder stage, not all source files
# So the size of the final image is smaller (This stage actually runs the app)

# Our app runs on port 3000, but the container might not have it open
# So we need to expose it
# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "run", "serve" ]
