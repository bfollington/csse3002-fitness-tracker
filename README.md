# Fitness Tracker

This repository contains two sub-projects:

- The Firmware for our fitness tracker device
- The web app for uploading, storing and visualising fitness data

## Web App

### Structure

The application is front-end heavy, and is build using [React.js](https://facebook.github.io/react/), [ES6 (via babel)](https://babeljs.io/), [SCSS](http://sass-lang.com/) and [Jade](http://jade-lang.com/). All the UI components are defined as React components within `/src/jsx`.

### Development Process

The development of the app relies on `gulp` as the build system. To get everything up and running, first make sure you're in the `/webapp` folder and that you have `npm` installed (see: [node.js](https://nodejs.org/)).

Once in the root of the app, run `npm install` to install all development dependencies. **Do not commit the `node_modules` folder to git**. After this is complete, run `npm install gulp -g` to install gulp globally as a command.

From here, you should be able to run `gulp build` in the root to compile all JSX, SCSS and Jade files. Obviously, source files are in `src/` and built files are in `dist/`.

#### Libraries

Any libraries should be placed in the `/dist` folder, within the relevant subfolder and then in a subfolder named `/lib`. E.g. for jQuery, we place `jQuery.js` in `/dist/js/lib/jQuery.js`.

### Starting the Application

To boot up the python server, simply run `python server.py` and the application will bind to port 8080. You can access the application by navigating to `localhost:8080`, `127.0.0.1:8080` or whatever other v-host you have set up.
