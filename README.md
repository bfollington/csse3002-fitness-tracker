# Fitness Tracker

This repository contains two sub-projects:

- The Firmware for our fitness tracker device
- The web app for uploading, storing and visualising fitness data

## Firmware

### Required Software:
 - Visual Studio 2013
 - Visual Micro (Arduino extension)
 - Adafruit's customised version of the Arduino IDE, OR
   Arduino IDE with correct Adafruit device descriptors.

### Build instructions:
 - Open the solution in Visual Studio 2013.
 - Select 'Adafruit Flora' from the device dropdown.
 - Press 'Build' from the menus.

### Test instructions:
 - Build and Execute the test project.
 - Results will be shown onscreen.

### Deployment instructions:
 - Select the correct COM port from the configuration dropdown.
 - Test the connection by opening the Serial Monitor and connecting to the device at the correct baud rate, with DTR enabled.
 - Press 'F5', or press 'Local Windows Debugger' to make Visual Micro compile and upload the software.


## Web App

### Structure

The application is front-end heavy, and is built using [React.js](https://facebook.github.io/react/), [ES6 (via babel)](https://babeljs.io/), [SCSS](http://sass-lang.com/) and [Jade](http://jade-lang.com/). All the UI components are defined as React components within `/src/jsx`.

### Database

The application uses [MongoDB](https://www.mongodb.org/) for persistence, and the database must be running to use the application. Additionally, [pymongo](http://api.mongodb.org/python/current/) is required for interfacing with MongoDB.

### Development Process

The development of the app relies on `gulp` as the build system. To get everything up and running, first make sure you're in the `/webapp` folder and that you have `npm` installed (see: [node.js](https://nodejs.org/)).

Once in the root of the app, run `npm install` to install all development dependencies. **Do not commit the `node_modules` folder to git**. After this is complete, run `npm install gulp -g` to install gulp globally as a command.

From here, you should be able to run `gulp build` in the root to compile all JSX, SCSS and Jade files. Obviously, source files are in `src/` and built files are in `dist/`.

#### Libraries

Any libraries should be placed in the `/dist` folder, within the relevant subfolder and then in a subfolder named `/lib`. E.g. for jQuery, we place `jQuery.js` in `/dist/js/lib/jQuery.js`.

### Starting the Application

Mongodb must be running to use the application, type `mongod` will start the database service. Before running the application for the first time, `python db.py` must be run to seed the database with initial data.

To boot up the python server, simply run `python server.py` and the application will bind to port 8080. You can access the application by navigating to `localhost:8080`, `127.0.0.1:8080` or whatever other v-host you have set up.
