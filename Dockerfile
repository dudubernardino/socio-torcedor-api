FROM node:18-alpine as BUILD_IMAGE

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

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/app/main"]