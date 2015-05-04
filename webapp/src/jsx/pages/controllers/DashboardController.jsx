import {DashboardPage} from "pages/DashboardPage.jsx";
import {transition} from "pages/controllers/PageTransition.jsx";

export function DashboardController(ctx, next) {
    transition(ctx, next, <DashboardPage />);
}
