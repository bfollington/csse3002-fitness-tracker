import {Body} from "components/Body.jsx";
import {LineChart} from "components/LineChart.jsx";
import {BarChart} from "components/BarChart.jsx";
import {RadarChart} from "components/RadarChart.jsx";
import {PieChart} from "components/PieChart.jsx";
import {MainNavbar} from "components/MainNavbar.jsx";
import {Map} from "components/Map.jsx";

export class RunDataPage extends React.Component {
    constructor() {
        this.state = {
            run: false
        }
    }

    componentDidMount() {
        $.get("/api/run/" + this.props.runId, function(result) {

            if (result.success != false) {
                this.setState({
                    run: result,
                });
            }

        }.bind(this));
    }

    render() {

        var body = (
            <div className="container">
                <div className="row">
                    <p>This run does not exist.</p>
                </div>
            </div>
        );

        if (this.state.run) {
            body = (
                <div className="container">
                    <div className="row">
                        <h1>Your Run on {this.state.run.start_time}</h1>
                        <Map waypoints={this.state.run.waypoints} />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <MainNavbar />
                {body}
            </div>
        );
    }
}
