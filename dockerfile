# Stage 1: Build React app
FROM node:24.14.0-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the React build to Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]