# Hello Conor

## Languages
- [Coffeescript](http://coffeescript.org/)
- [Jade](http://jade-lang.com/)
- [Less](http://www.lesscss.org/)

## Framework|Tools
- [AngularJS](http://angularjs.org/)
- [Bootstrap3](http://getbootstrap.com/)
- [Gulp](http://gulpjs.com/)
- Livereload

## Installation
[Install npm](https://nodejs.org/download/)
Install bower by running this command
  `npm install -g bower`
  
Run these two commands in the command line.
  `npm install`
  `bower install`

## Development server
Run this command to host a development server

  `npm run-script watch`

Access to the application at this address: http://127.0.0.1:8008
The livereload update your browser each time you change source files.

## Your Function
Go to src-public/controllers/member.coffee, and scroll down until you see 
	```
	$scope.matchAll = () ->
		...
		...
	```
This is the function for you to edit. I've already queried the database, and iteratively updated the database at the end of the function.

## Testing
Add /conortest to the end of your development server URL. There's a button that you can hit that will run your function. Use the console to check what's happening (I've demonstrated how to print to the console at the end of your function. To see the Javascript console on your browser, hit Command+Option+J). One catch; it sometimes takes a little while for the front end to connect to the backend, and if you hit the test button before this connection has been made, nothing will happen. If you open up the console, a bunch of info will be printed to it once the front end connects to the back end, so just make sure that happens before you hit test.