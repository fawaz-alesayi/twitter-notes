FROM gitpod/workspace-full:latest

# pnpm
RUN curl -f https://get.pnpm.io/v6.14.js | node - add --global pnpm

# railway cli
RUN sudo sh -c "$(curl -sSL https://raw.githubusercontent.com/railwayapp/cli/master/install.sh)"