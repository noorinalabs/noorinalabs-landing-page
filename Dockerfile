# Stage 1: Build
# Digest-pinned tag + apk upgrade (base-image pinning gate, noorinalabs-main#735/#744):
# freezes the layer AND patches within-tag Alpine package drift.
FROM node:22-alpine@sha256:ab07539e0988b63558ff621f5fbe1077054c39d9809112974fb79993949d41cd AS build
RUN apk upgrade --no-cache
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
FROM nginx:alpine@sha256:1a8724a52d432501548a8d8681bb1554c2d09778f8b9ed0882fc3442549980b7
RUN apk upgrade --no-cache
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
