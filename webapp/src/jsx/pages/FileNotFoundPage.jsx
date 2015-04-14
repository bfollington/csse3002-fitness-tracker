import {Navbar} from "components/Navbar.jsx";

export class FileNotFoundPage extends React.Component {
    constructor() {

    }

    render() {

        return (
            <div>
                <Navbar links={ [{name: "Test", url: "test", click: function(){}, context: this}] }/>
                <div className="container">
                    <h1>404</h1>
                </div>
            </div>
        );
    }
}
