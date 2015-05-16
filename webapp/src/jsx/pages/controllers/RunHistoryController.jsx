import {RunHistoryPage} from "pages/RunHistoryPage.jsx";
import {transition} from "pages/controllers/PageTransition.jsx";

export function RunHistoryController(ctx, next) {
    transition(ctx, next, <RunHistoryPage />);
}
