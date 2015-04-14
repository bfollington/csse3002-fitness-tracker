import {Router} from 'Router.jsx';
import {DashboardController} from './pages/controllers/DashboardController.jsx';
import {FileNotFoundController} from './pages/controllers/FileNotFoundController.jsx';

(function() {
    window.app = {};

    window.app.router = new Router('mount');
    var router = window.app.router;

    router.addRoute('/404', FileNotFoundController);
    router.addRoute('/', DashboardController);
    router.addRoute('/dashboard', DashboardController);

    router.start();
})();

