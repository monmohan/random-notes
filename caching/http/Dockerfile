FROM node:8
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
ADD build  ./build
COPY src/resources.html ./src/
EXPOSE 9000
CMD [ "npm", "start" ]