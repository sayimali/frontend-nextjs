FROM node:20-alpine

WORKDIR /app

COPY . .

# Husky & prepare scripts skip
ENV NODE_ENV=production
RUN npm install --production --legacy-peer-deps --ignore-scripts

EXPOSE 3000

CMD ["npm", "run", "start"]
