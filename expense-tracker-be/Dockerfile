# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start app with DB migration
# CMD ["node","dist/app.js"]
# ⬆️ Old command (commented)

# ✅ Run DB migration first, then start server
CMD npm run migrate && node dist/app.js
