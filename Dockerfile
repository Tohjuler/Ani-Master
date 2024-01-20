FROM node:18-alpine

RUN apk add --no-cache libc6-compat git

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]