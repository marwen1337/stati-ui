FROM node:21-alpine

# create destination directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy package.json first for caching
COPY package.json /usr/src/app/package.json
RUN npm install

# copy the app, note .dockerignore
COPY . /usr/src/app/

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build

# expose 5000 on container
EXPOSE 5000

# set app serving to permissive / assigned
ENV NITRO_HOST=0.0.0.0
# set app port
ENV NITRO_PORT=5000

# start the app
CMD [ "npm", "start" ]
