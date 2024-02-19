# Use the latest Node.js 20.x base image for compatibility with your project
FROM node:20-bullseye

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including 'devDependencies' for development tools like nodemon)
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# Command to run your app using nodemon for development
CMD ["npm", "run", "dev"]

