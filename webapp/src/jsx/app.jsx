import {Router} from 'Router.jsx';
import {DashboardController} from './pages/controllers/DashboardController.jsx';
import {FileNotFoundController} from './pages/controllers/FileNotFoundController.jsx';
import {RunDataController} from './pages/controllers/RunDataController.jsx';


var moment = require("moment");

(function() {
    window.app = {};

    window.app.moment = moment;
    window.app.dayFormat = "dddd, MMM Do YYYY";
    window.app.timeFormat = "h:mm:ss a";

    window.app.router = new Router('mount');
    var router = window.app.router;

    router.addRoute('/404', FileNotFoundController);
    router.addRoute('/dashboard', DashboardController);
    router.addRoute('/run/:run', RunDataController);
    router.addRoute('/', DashboardController);

    router.start();
})();

