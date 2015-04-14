import {FileNotFoundPage} from "pages/FileNotFoundPage.jsx";

export function FileNotFoundController(ctx, next) {
    React.render(<FileNotFoundPage />, window.app.mountPoint);
}
