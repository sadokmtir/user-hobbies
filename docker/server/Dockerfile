FROM node:12-alpine as base

RUN mkdir -p /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

#=========================================================================
#=========================================================================

FROM base as develop

RUN rm -rf ./docker

COPY package*.json ./
COPY src/ src/

RUN npm ci --quiet && npm run build

COPY config ./dist

#=========================================================================

#=========================================================================
FROM local as build

RUN rm -rf ./docker

COPY package*.json ./
COPY src/ src/

RUN npm ci --quiet --only=production && npm run build

COPY config ./dist
#=========================================================================

#=========================================================================
FROM base as live
COPY --from=build /home/node/app/dist /home/node/app
CMD [ "node", "app.js" ]
#=========================================================================
