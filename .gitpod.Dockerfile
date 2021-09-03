FROM gitpod/workspace-full:latest

# pnpm
RUN curl -f https://get.pnpm.io/v6.14.js | node - add --global pnpm

# railway cli
RUN sudo sh -c "$(curl -sSL https://raw.githubusercontent.com/railwayapp/cli/master/install.sh)"

# dbmate
RUN sudo curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64 && sudo chmod +x /usr/local/bin/dbmate