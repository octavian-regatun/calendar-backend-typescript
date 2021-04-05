FROM node:lts-alpine
WORKDIR /app
COPY . ./calendar-backend-typescript
RUN cd calendar-backend-typescript && npm install
RUN apk add --update git
RUN git clone https://github.com/octavian-regatun/calendar-frontend-typescript
RUN cd calendar-frontend-typescript && npm install
RUN cd calendar-frontend-typescript && npm run build
CMD cd calendar-backend-typescript && npm run start
