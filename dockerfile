FROM node:alpine
WORKDIR /usr/src/server
COPY package*.json .
RUN npm ci
COPY . .
CMD ["npm", "start"]