import {Router} from 'Router.jsx';
import {DashboardController} from './pages/controllers/DashboardController.jsx';
import {RunHistoryController} from './pages/controllers/RunHistoryController.jsx';
import {FileNotFoundController} from './pages/controllers/FileNotFoundController.jsx';
import {RunDataController} from './pages/controllers/RunDataController.jsx';


var moment = require("moment");

(function() {
    /* A global object to hold utilities. */
    window.app = {};

    /* Expose the moment module. */
    window.app.moment = moment;
    /* Specify the global formats for time and date. */
    window.app.dayFormat = "dddd, MMM Do YYYY";
    window.app.timeFormat = "h:mm:ss a";

    /* Specify the routes for each screen. */
    window.app.router = new Router('mount');
    var router = window.app.router;

    router.addRoute('/404', FileNotFoundController);
    router.addRoute('/dashboard', DashboardController);
    router.addRoute('/history', RunHistoryController);
    router.addRoute('/run/:run', RunDataController);
    router.addRoute('/', DashboardController);

    router.start();
})();
