FROM gitpod/workspace-base:latest

# Install custom tools, runtime, etc.
RUN curl -f https://get.pnpm.io/v6.14.js | node - add --global pnpm