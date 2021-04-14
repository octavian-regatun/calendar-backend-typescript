FROM node:lts-alpine
WORKDIR /app
COPY . ./planitly-api
RUN cd planitly-api && npm install
CMD cd planitly-api && npm run start