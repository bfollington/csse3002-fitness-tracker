import {RunHistoryPage} from "pages/RunHistoryPage.jsx";
import {transition} from "pages/controllers/PageTransition.jsx";

/*
 * Handles transition to the run history page.
 */
export function RunHistoryController(ctx, next) {
    transition(ctx, next, <RunHistoryPage />);
}
