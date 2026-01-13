FROM node:25-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV VITE_API_BASE=/api

RUN npm run build

FROM node:25-alpine

RUN apk add --no-cache nginx supervisor

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --production

COPY server/index.js ./

COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 3000

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
