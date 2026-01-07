FROM node:20-alpine

WORKDIR /app

COPY . .

ENV NODE_ENV=production
ENV HUSKY=0

RUN npm install --production --legacy-peer-deps --ignore-scripts

EXPOSE 3000

CMD ["npm", "run", "start"]
