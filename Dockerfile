FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production --legacy-peer-deps --ignore-scripts

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV HUSKY=0

EXPOSE 3000

CMD ["npm", "run", "start"]
