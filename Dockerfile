FROM node:18
LABEL authors="mt1607"

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]