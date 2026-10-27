FROM node:26.12.1-slim
ENV NODE_ENV=production
WORKDIR /opt/nkd-registration-manager/
COPY ./package*.json ./
RUN npm ci

COPY ./ ./

CMD ["npm", "run", "start"]
