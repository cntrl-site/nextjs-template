FROM node:lts-alpine AS nextjs-template
WORKDIR /usr/src/app
COPY ./package.json ./package-lock.json ./
ARG GHPKG_PAT
RUN /bin/sh -c "\
  echo \"//npm.pkg.github.com/:_authToken=${GHPKG_PAT}\" >> .npmrc && \
  echo \"@cntrl-site:registry=https://npm.pkg.github.com\" >> .npmrc \
"
RUN npm ci
COPY ./tsconfig.json ./next.config.js ./
COPY ./public ./public
COPY ./cntrl-client ./cntrl-client
COPY ./components ./components
COPY ./styles ./styles
COPY ./pages ./pages
ARG CNTRL_API_URL
ARG CNTRL_PROJECT_ID
# to bust cache on Digital Ocean build trigger
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN npm run export
