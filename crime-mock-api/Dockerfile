# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the crime server file
COPY crime-server.js .

# Expose the port the server runs on
EXPOSE 3001

# Set environment variable for the port
ENV PORT=3001

# Command to run the server
CMD ["node", "crime-server.js"]
