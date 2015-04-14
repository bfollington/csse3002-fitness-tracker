import page from 'page';
import {FileNotFoundPage} from "pages/FileNotFoundPage.jsx";

export class Router {
    constructor(mountPointId) {
        this.routes = {};

        window.app.mountPoint = document.getElementById(mountPointId);
        this.mountPoint = window.app.mountPoint;
    }

    addRoute(route, controller) {
        this.routes[route] = controller;
    }

    start() {

        var me = this;

        for (var i in this.routes)
        {
            page(i, this.routes[i]);
        }

        page("*", function(ctx, next) {
            console.error("404", ctx, next);
            React.render(<FileNotFoundPage />, window.app.mountPoint);
        });

        page();
    }
}
