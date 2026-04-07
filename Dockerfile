# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN=$(cat /run/secrets/npm_token 2>/dev/null || echo "") && \
    if [ -n "$NPM_TOKEN" ]; then echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" >> .npmrc; fi && \
    npm ci && \
    rm -f .npmrc
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
