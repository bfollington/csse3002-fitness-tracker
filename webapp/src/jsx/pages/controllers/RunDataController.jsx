import {RunDataPage} from "pages/RunDataPage.jsx";
import {transition} from "pages/controllers/PageTransition.jsx";

/*
 * Handles transition to the run data page. Accepts a run ID as
 * a parameter, which is passed to the page.
 */
export function RunDataController(ctx, next) {
    transition(ctx, next, <RunDataPage runId={ctx.params.run}/>);
}
