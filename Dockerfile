# Use the latest Node.js 20.x base image for compatibility with your project
FROM node:20-bullseye

# Set the working directory in the container
WORKDIR /usr/src/app

# Clear npm cache to avoid any caching issues
RUN npm cache clean --force

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including 'devDependencies' for development tools like nodemon)
RUN npm install -g typescript
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Make sure the script has execution permissions
RUN chmod +x /usr/src/app/start-dev.sh

# Expose the port your app runs on
EXPOSE 3001
