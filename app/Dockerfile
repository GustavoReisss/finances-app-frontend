FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -g @angular/cli@17.2.1

RUN npm install

COPY . .

CMD [ "ng", "serve", "--host", "0.0.0.0" ]