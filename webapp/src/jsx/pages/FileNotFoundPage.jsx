import {MainNavbar} from "components/MainNavbar.jsx";

/*
 * Simple page served when a route cannot be found.
 */
export class FileNotFoundPage extends React.Component {
    constructor() {
    }

    render() {
        return (
            <div>
                <MainNavbar />
                <div className="container">
                    <h1>404</h1>
                </div>
            </div>
        );
    }
}
