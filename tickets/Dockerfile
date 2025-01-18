FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 4000

RUN npm run build

CMD [ "npm", "run" , "dev" ]