import {Body} from "components/Body.jsx";
import {LineChart} from "components/LineChart.jsx";
import {BarChart} from "components/BarChart.jsx";
import {RadarChart} from "components/RadarChart.jsx";
import {PieChart} from "components/PieChart.jsx";
import {MainNavbar} from "components/MainNavbar.jsx";

export class RunDataPage extends React.Component {
    constructor() {

    }

    render() {

        return (
            <div>
                <MainNavbar />
                <div className="container">
                    {this.props.runId}
                </div>
            </div>
        );
    }
}
