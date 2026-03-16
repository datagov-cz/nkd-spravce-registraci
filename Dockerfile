FROM node:21.1.0-bullseye

WORKDIR /opt/nkd-registration-manager/
COPY ./package*.json ./
RUN npm ci

COPY ./ ./

CMD ["npm", "run", "start"]
