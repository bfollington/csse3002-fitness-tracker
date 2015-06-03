import {FileNotFoundPage} from "pages/FileNotFoundPage.jsx";
import {transition} from "pages/controllers/PageTransition.jsx";

/*
 * Handles transition to the 404 page.
 */
export function FileNotFoundController(ctx, next) {
    transition(ctx, next, <FileNotFoundPage />);
}
