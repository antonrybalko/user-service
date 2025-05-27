# Use the latest Node.js 20.x base image for compatibility with your project
FROM node:20-bullseye

# Set the working directory in the container
WORKDIR /usr/src/app

# Enable yarn and clear cache
RUN corepack enable
RUN yarn cache clean

# Copy package.json and yarn.lock
COPY package.json yarn.lock* ./

# Install all dependencies (including 'devDependencies' for development tools like nodemon)
RUN yarn global add typescript
RUN yarn install

# Copy the rest of your application's source code
COPY . .

# Make sure the script has execution permissions
RUN chmod +x /usr/src/app/start-dev.sh

# Expose the port your app runs on
EXPOSE 3001
