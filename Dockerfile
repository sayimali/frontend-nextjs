# Use Node lightweight image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy local code (already built)
COPY . .

# If node_modules already present locally, skip npm install
# Else install production dependencies only
RUN npm install --production --legacy-peer-deps

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
