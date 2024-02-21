FROM node:19-alpine
ARG api_base_url
WORKDIR /app
COPY package*.json .
ENV GENERATE_SOURCEMAP=false
RUN npm i --force
COPY . .
RUN echo "REACT_APP_API_BASE_URL=${api_base_url}" > .env
EXPOSE 3000
CMD ["npm", "start"]

#FROM nginx:1.22.1-alpine as prod-stage
#COPY --from=build-stage /app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]