import {RunDataPage} from "pages/RunDataPage.jsx";
import {transition} from "pages/controllers/PageTransition.jsx";

export function RunDataController(ctx, next) {
    transition(ctx, next, <RunDataPage runId={ctx.params.run}/>);
}
