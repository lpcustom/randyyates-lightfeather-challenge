FROM node:latest as build
WORKDIR /usr/local/app
COPY . /usr/local/app/
RUN npm install --global @angular/cli
RUN yarn install
RUN ng build --configuration=production

FROM nginx:1.17.1-alpine
COPY --from=build /usr/local/app/dist/frontend /usr/share/nginx/html
EXPOSE 80
