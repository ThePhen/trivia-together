#Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
RUN npm run build

#Production stage
FROM node:16-alpine AS production
LABEL com.thephen.trivia-together="backend-ts"
LABEL version="0.0.0"
WORKDIR /app
COPY package*.json .
ENV NODE_ENV=production
ENV SERVER_PORT=3000
RUN npm ci --only=production
EXPOSE 3000
COPY --from=build /app/dist ./dist
CMD ["node", "dist/index.js"]
