# Staging image: serves any project's site on demand. Built once per branch,
# started per project with CNTRL_API_URL and NEXT_PUBLIC_BASE_PATH set.
FROM node:20-alpine

WORKDIR /app

# Persists into the running container: `next start` re-reads next.config.js
# and must see the same mode the image was built with.
ENV CNTRL_BUILD_MODE=staging

COPY package*.json ./
RUN npm ci

COPY . .

# `next build` directly, not `npm run build`: the prebuild hook generates
# layouts and a sitemap from a project's API, and this image has no project.
RUN npx next build

EXPOSE 3000

CMD ["npm", "start"]
