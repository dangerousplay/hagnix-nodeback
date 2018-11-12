FROM node:11 as builder

RUN mkdir -p /app/bin

COPY . /app

COPY /package.json /app

WORKDIR /app

RUN npm install --production

FROM node:11-alpine

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV="production"

CMD ["npm", "start"]
