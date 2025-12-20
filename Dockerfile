# Base image Node.js alpine
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package & install dependencies
COPY package*.json ./
RUN npm install

# Copy sisa source code
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD [ "npm", "start" ]