FROM node:latest

ENV NODE_ENV=production
WORKDIR /front

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production --force
COPY . .

CMD [ "npm", "run", "server" ]
