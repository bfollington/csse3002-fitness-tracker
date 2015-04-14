import {FileNotFoundPage} from "pages/FileNotFoundPage.jsx";
import {transition} from "pages/controllers/PageTransition.jsx";

export function FileNotFoundController(ctx, next) {
    transition(ctx, next, <FileNotFoundPage />);
}
