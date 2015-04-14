export function transition(ctx, next, component) {
    if (!ctx.init) {
        window.app.mountPoint.classList.add('transition');
        setTimeout(function(){
            window.app.mountPoint.classList.remove('transition');
        }, 200);
    }

    React.render(component, window.app.mountPoint);
}
