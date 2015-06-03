import page from 'page';
import {FileNotFoundPage} from "pages/FileNotFoundPage.jsx";

/*
 * Handles routing pages within the application using page.js.
 */
export class Router {
    constructor(mountPointId) {
        /* Mount the application to the element specified by the given ID. */
        this.routes = {};

        window.app.mountPoint = document.getElementById(mountPointId);
        this.mountPoint = window.app.mountPoint;
    }

    /*
     * Add a mapping from route URL to Javascript controller.
     */
    addRoute(route, controller) {
        this.routes[route] = controller;
    }

    start() {

        var me = this;
        /* Register each of the routes with page.js. */
        for (var i in this.routes) {
            page(i, this.routes[i]);
        }

        /*
         * If a page is not matched by the existing routes, fall through
         * to the 404 not found page.
         */
        page("*", function(ctx, next) {
            console.error("404", ctx, next);
            React.render(<FileNotFoundPage />, window.app.mountPoint);
        });

        /* Start the router. */
        page();
    }
}
