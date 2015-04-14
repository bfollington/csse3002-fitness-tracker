import {DashboardPage} from "pages/DashboardPage.jsx";

export function DashboardController(ctx, next) {
    React.render(<DashboardPage />, window.app.mountPoint);
}
