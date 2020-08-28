#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:12.13.0-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY swagger*.json ./
COPY ./bin ./bin
COPY ./src ./src
COPY ecosystem.config.yml ./
COPY entrypoint.sh ./
RUN npm ci --quiet --only=production
RUN npm install pm2 -g --quiet

CMD [ "pm2-runtime", "start", "ecosystem.config.yml" ]

EXPOSE 3000

VOLUME /app/.env
