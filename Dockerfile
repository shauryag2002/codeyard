FROM node:22-alpine
WORKDIR /app
RUN apk add --update python3 make g++ \
    && apk add --no-cache \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    && rm -rf /var/cache/apk/*
COPY . .
RUN npm install
EXPOSE 3000
CMD ["./startup.sh"]