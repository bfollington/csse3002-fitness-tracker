import {ModalTrigger} from "./ModalTrigger.jsx"
import {AppSettingsModal} from "./AppSettingsModal.jsx"
import {ImportDataModal} from "components/ImportDataModal.jsx"
import {UploadDataButton} from "components/UploadDataButton.jsx"

/**
 * A generic navbar class based on the bootstrap navbar structure.
 *
 * Links can be proved as an array of various option objects.
 */
export class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    {/* Mobile menu */}
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">Living Dead Fitness Tracker</a>
                    </div>

                    {/* Link list */}
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            {
                                this.props.links.map( function(entry) {

                                    if (typeof entry.component != "undefined") {
                                        return (<li>{entry.component}</li>);
                                    } else {
                                        if (entry.button) {
                                            return (<li><button className="btn btn-default navbar-btn" onClick={entry.click.bind(entry.context)}>{entry.name}</button></li>);
                                        } else {
                                            return (<li><a href={entry.url} onClick={entry.click.bind(entry.context)}><i className={entry.icon} /> {entry.name}</a></li>);
                                        }
                                    }

                                })
                            }
                        </ul>

                        {/* Other options, such as settings and import */}
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <ModalTrigger modal={<ImportDataModal />} button={true} className="btn btn-default navbar-btn margin-right" buttonText={<UploadDataButton />} />
                            </li>
                            <li>
                                <ModalTrigger modal={<AppSettingsModal />} button={true} className="btn btn-default navbar-btn" buttonText={<i className="ion ion-gear-a"></i>} />
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
