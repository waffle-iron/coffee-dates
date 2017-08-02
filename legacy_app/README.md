# Application

This application is to streamline the assignment and reporting of coffee dates during the rush process, to make No. II's job a little more pleasant, and less repetitive. This is the admin side of the application, that we are running only from a local server, for security purposes (so that the code is not available to the web, as the developer's knowledge of web security is limited).

## Legacy Notes

Note that this is a legacy application. There are lots of bad practices in here. Here are some of the more egregious and notable:

 - A modified file in `bower_components/angular-parse/angular-parse.js`, where 'https://www.parse.com/1' has been changed to 'http://localhost:1337/parse' to read from a Parse server rather than Parse.com. I briefly looked into forking the current implementation of angular-parse so that install would work, but decided that it's not worth it because hopefully this admin interface will be phased out quickly.
 - Users and Members are associated by last name (I know, horrifically fragile). That is to say, when you create a new User for the platform (to give members login access), you must also create a corresponding Member whose _last name is the same as the new user's username_. You can check that this association is working by logging into the new user's account and confirming that the member's full name shows up on the home logged in screen.

# Technologies

## Languages
- [Coffeescript](http://coffeescript.org/)
- [Jade](http://jade-lang.com/)
- [Less](http://www.lesscss.org/)

## Framework|Tools
- [AngularJS](http://angularjs.org/)
- [Bootstrap3](http://getbootstrap.com/)
- [Gulp](http://gulpjs.com/)
- Livereload

## Requirements

- [NodeJS](http://nodejs.org/)
- [Bower](https://bower.io/)

## Installation
```
npm install
bower install
```

Change the file `bower_components/angular-parse/angular-parse.js` as specified in the 'Legacy Notes' section above.

# Server Configuration

The app is configured to be connected to a local Parse server, which you can run easily through [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/). Once you have these two softwares installed, simply go into the `server/ParseServer` folder, and run `sh run.sh` (assuming you're on a Mac or Linux). That will start up the server; then open up another terminal in the same folder and run `sh initialize.sh` to populate the database tables with the appropriate fields. You should now be able to visit `localhost:4040` and login with the username 'admin' and the password 'password' to see the backend.

You should be able to login to the actual app (see 'Development server' section below) with the username 'Kermode' and the password 'blood95' after executing the above steps.

# Development server

  `npm run-script watch`

Access to the application at this address: http://127.0.0.1:8008
The livereload update your browser each time you change source files.

The Frontend source files are into the [src-public](./src-public) directory and compile to the public directory.
The Backend source files are into the [src-cloud](./src-cloud) directory and compile to the cloud directory. NB: The developer did not use these backend source files.

## Parse Config (only if/when we change and actually centralize Parse keys)

Edit the [config/global.json](./config/global.json) file to write the configuration of your Parse.com project in order to use the Parse's CLI.
Edit the [src-public/app.coffee](./src-public/app.coffee) file to replace the ParseProvider keys.
