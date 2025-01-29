FROM node:21-alpine AS build

# create destination directory
RUN mkdir -p /app
WORKDIR /app

# copy package.json first for caching
COPY package.json /app/package.json
RUN npm install

# copy the app, note .dockerignore
COPY . /app/

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build

FROM node:22-alpine AS runtime

COPY --from=build /app/.output /app/.output
COPY --from=build /app/package*.json /app/

# expose 5000 on container
EXPOSE 5000

# set app serving to permissive / assigned
ENV NITRO_HOST=0.0.0.0
# set app port
ENV NITRO_PORT=5000

# start the app
CMD [ "npm", "start" ]
