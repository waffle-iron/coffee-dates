# Plastic Anthony
<small style="font-size:12pt;">A web (and mobile?) platform for St Anthony's Hall.</small>

## Blurb

This repo contains the code for the developing _Plastic Anthony_ platform, which is currently in a transitional state. The core codebase is a React and Redux application built from [Max Stoiber's boilerplate](https://github.com/mxstbr/react-boilerplate). Still in legacy use, however, is an Angular and Parse rush/coffee date application that was used in 2015. We don't have enough time to refactor this whole application for 2016 rush, so we will be using the legacy admin portal (angular) with the new and refurbished member portal (react/redux). The legacy application ran using [parse.com](https://parse.com/), but due to the recent depredation of that platform, the 2016 rush process will run a server through a Dockerized [Parse Server](https://github.com/ParsePlatform/parse-server) (the parse.com) open source equivalent.

## Quick start

1. Clone this repo using `git clone --depth=1 https://github.com/mxstbr/react-boilerplate.git`
1. Run `npm run setup` to install dependencies and clean the git repo.<br />
   *At this point you can run `npm start` to see the example app at `http://localhost:3000`.*
1. Run `npm run clean` to delete the example app.

Now you're ready to rumble!

> Please note that this boilerplate is **not meant for beginners**! If you're just starting out with react or redux, please refer to https://github.com/petehunt/react-howto instead.

## Documentation

- [Intro](docs/general): What's included and why
- [**Commands**](docs/general/commands.md): Getting the most out of this boilerplate
- [Testing](docs/testing): How to work with the built-in test harness
- [Styling](docs/css): How to work with the CSS tooling
- [Your app](docs/js): Supercharging your app with Routing, Redux, simple
  asynchronicity helpers, etc.

## Legacy Application

Go to the `rush-admin` folder and see the README.md there.
