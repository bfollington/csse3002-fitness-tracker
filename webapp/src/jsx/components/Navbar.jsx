export class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">Living Dead Fitness Tracker</a>
                    </div>

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
                                            return (<li><a href={entry.url} onClick={entry.click.bind(entry.context)}>{entry.name}</a></li>);
                                        }
                                    }

                                })
                            }
                        </ul>

                        <ul className="nav navbar-nav navbar-right">
                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Settings <span className="caret"></span></a>
                                <ul className="dropdown-menu" role="menu">
                                    <li><a href="#">Your Device</a></li>
                                    <li><a href="#">Application Settings</a></li>
                                    <li className="divider"></li>
                                    <li><a href="#">Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
