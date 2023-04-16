FROM node:14-alpine as build

# basic requirements
RUN apk update && apk add python3 yarn curl bash &&\
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

######
FROM node:14-alpine

WORKDIR /app

RUN yarn install --frozen-lockfile --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/src/main"]