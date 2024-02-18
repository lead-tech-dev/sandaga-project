FROM node:16-alpine
WORKDIR /app
COPY package*.json .
ENV GENERATE_SOURCEMAP=false
RUN npm i --force
COPY . .
RUN echo "REACT_APP_API_BASE_URL=http://localhost:8088" > .env
EXPOSE 3000
CMD ["npm", "run", "start"]