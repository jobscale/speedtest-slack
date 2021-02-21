FROM node:buster-slim
SHELL ["bash", "-c"]
WORKDIR /home/node
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y git curl speedtest-cli
COPY package.json package.json
COPY app app
RUN chown -R node. .
USER node
RUN npm i --production && cat node_modules/speedtest/index.js
CMD ["npm", "start"]
