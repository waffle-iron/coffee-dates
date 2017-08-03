# Getting Started

This is the best place to start to get up and running with the Plastic Anthony application as a developer. The application was originally made by Brother Kermode in the summer of 2015 as an Angular2.x application, and was then ported to a React and Redux application in the summer of 2016, and refined in 2017. Fair warning; if you don't know anything about React or Redux, you're going to have a _very_ difficult time working on this codebase.

## Square 0

### React and Redux Resources
Start by learning React *without* Redux, as trying to learn the two together can be overwhelming. The [official tutorial](https://facebook.github.io/react/tutorial/tutorial.html) is a great place to start, and here are some other useful guides:

 * [Hacking with React](http://www.hackingwithreact.com/)
 * [React Armory](https://reactarmory.com/guides/learn-nude-react)

Once you feel comfortable in React, you should be able to understand a lot of this codebase. Redux is a state management library that handles things like user information, routing, and other data processing logic. Again, the [official documentation](http://redux.js.org/) is the best place to start. You can then look to the wealth of other online resources:

 * [Learn Redux](https://learnredux.com/)
 * [Learn Redux (in a single file)](https://github.com/wesbos/Learn-Redux)

### React Boilerplate
Now that you know React and Redux, you should be ready to take a look at Plastic Anthony (PA). Note that PA uses several other abstractions, such as [Redux Sagas](https://github.com/redux-saga/redux-saga) and [Redux Thunk](https://github.com/gaearon/redux-thunk). Don't worry about these technologies just now, but be aware that you may need to understand their basics to make meaningful modifications to the application.

PA was developed from the [React Boilerplate](https://github.com/react-boilerplate/react-boilerplate) starter, which provides a high-grade development environment for React applications. The boilerplate also provides [very useful documentation](https://github.com/react-boilerplate/react-boilerplate/tree/master/docs) on the frameworks and abstractions it uses.

### Serverside: Parse and Docker
The original server ran through Parse.com, a backend software-as-a-service provided by Facebook. The SAAS Parse was discontinued in 2015, however (presumably because the business model wasn't sustainable at scale), and its [code was open sourced](http://blog.parse.com/tags/open-source/). This makes running PA a little more complicated, though thanks to [Docker](https://www.docker.com/what-docker) the setup is still relatively painless.

Hopefully you won't have to touch the Parse/Docker side of the application too much; it should just run in the background and power the application (though, realistically, at some stage APIs will undergo breaking changes, and someone will likely have to mess with that side of affairs). The server runs through a set of docker images provided for Parse, [Docker Parse](https://github.com/yongjhih/docker-parse-server), the setup for which will be explained below.

## Square 1

### Front End
If the digest in 'Square 0' is old hat, you're ready to get up and running with a PA development environment. Clone the code from Git, and install the dependencies:
```bash
git clone https://github.com/plasticanthony/coffee-dates
cd coffee-dates
yarn # or 'npm install'
npm start
```

Provided you've used Git, Node and NPM/Yarn before (if you haven't, look them up!) you should now have a front-end development server running. If you go to [localhost:3000](https://localhost:3000) you should see a login page. You shouldn't be able to log in, as there's no server running to power the authentication; it's just a front. (If interested in data aesthetics, [see here](https://www.amazon.com/Interface-Effect-Alexander-R-Galloway/dp/0745662536).)

### Server (Back End)


