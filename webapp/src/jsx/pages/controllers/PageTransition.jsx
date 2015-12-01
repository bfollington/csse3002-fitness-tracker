/*
 * Handles the transition from one page to the next.
 * Mounts the new component, and removes the previous once
 * the page has been animated in.
 */
export function transition(ctx, next, component) {
    if (!ctx.init) {
        window.app.mountPoint.classList.add('transition');
        setTimeout(function(){
            window.app.mountPoint.classList.remove('transition');
        }, 350);
    }

    React.render(component, window.app.mountPoint);
}
