import {Body} from "components/Body.jsx";
import {LineChart} from "components/LineChart.jsx";
import {Navbar} from "components/Navbar.jsx";

export class DashboardPage extends React.Component {
    constructor() {

    }

    render() {

        var chartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        return (
            <div>
                <Navbar links={ [{name: "Test", url: "test", click: function(){}, context: this}] }/>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-6">
                            <Body />
                        </div>
                        <div className="col-xs-6">
                            <LineChart data={chartData} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
