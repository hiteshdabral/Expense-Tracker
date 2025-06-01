# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependency
RUN npm install

# Copy source code 
COPY . .

#BUILT typescript
RUN npm run build

#EXPOSE PORT
EXPOSE 5000

# Start app
CMD ["node","dist/app.js"]