# Base image Node.js alpine
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package json & install deps
COPY package*.json ./
RUN npm install

# Copy sisa source code
COPY . .

# Expose port (opsional)
EXPOSE 3001

# Start app
CMD [ "npm", "start" ]