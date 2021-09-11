# twitter-notes (name not determined yet)

## Installation & Configuration

### Prerequisites for all

- Setup an account in Railway

### Gitpod (perferred)

We are using Gitpod for development.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/fawaz-alesayi/twitter-notes)

#### Configuration

To login to Railway run

```
railway login
```

Then sync the `twitter-notes` project to this repository to use environment variables

```
railway link
```

### Linux, MacOS

- [node >= v14](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Railway CLI](https://docs.railway.app/cli/installation)

## Usage

### Commands

```
"pnpm test" - to run all tests
"pnpm start" - to start the web server
```

### Environment Variables

To run a command with the environment variables set

```
railway run "your command here"
railway run "pnpm start"
```

### Deployment

```
"railway up" - to deploy the application to production
```
