FROM node:20.7.0-buster

WORKDIR /app_back

COPY . .

RUN npm i

CMD ["npm", "run", "start:dev"]
