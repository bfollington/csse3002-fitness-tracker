import {DashboardPage} from "pages/DashboardPage.jsx";
import {transition} from "pages/controllers/PageTransition.jsx";

/*
 * Handles transition to the dashboard page.
 */
export function DashboardController(ctx, next) {
    transition(ctx, next, <DashboardPage />);
}
