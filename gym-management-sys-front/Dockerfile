# Use node image for building
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight server (nginx) to serve the app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for serving frontend
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]