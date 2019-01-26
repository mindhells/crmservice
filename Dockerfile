FROM node
RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN npm install --quiet
RUN npm install nodemon -g --quiet
COPY . .
EXPOSE 4000
CMD nodemon -L --watch . server.js