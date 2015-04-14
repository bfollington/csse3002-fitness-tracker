import page from 'page';

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

        page("*", function(ctx, next) {
            if (typeof me.routes[ctx.path] == "undefined") {
                console.error("404");
                page.redirect("/404");
            } else {
                next();
            }
        });

        page('*', function(ctx,  next) {
            // No initial transition
            if (ctx.init) {
                next();
            } else {
                window.app.mountPoint.classList.add('transition');
                setTimeout(function(){
                    window.app.mountPoint.classList.remove('transition');
                    next();
                }, 200);
            }
        });


        for (var i in this.routes)
        {
            page(i, this.routes[i]);
        }

        page();
    }
}
