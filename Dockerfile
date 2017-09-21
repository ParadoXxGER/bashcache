FROM node:slim

COPY ./app.js /home/app.js

COPY ./index.html /home/index.html

COPY ./package.json /home/package.json

RUN cd /home && npm install

COPY ./entrypoint.sh /home/entrypoint.sh

RUN chmod +x /home/entrypoint.sh

ENTRYPOINT /home/entrypoint.sh