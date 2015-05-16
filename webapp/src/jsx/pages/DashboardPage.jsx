import {Body} from "components/Body.jsx";
import {LineChart} from "components/LineChart.jsx";
import {BarChart} from "components/BarChart.jsx";
import {RadarChart} from "components/RadarChart.jsx";
import {PieChart} from "components/PieChart.jsx";
import {MainNavbar} from "components/MainNavbar.jsx";
import {ModalTrigger} from "components/ModalTrigger.jsx";
import {ImportDataModal} from "components/ImportDataModal.jsx";

export class DashboardPage extends React.Component {
    constructor() {
        this.state = {
            runs: null
        }
    }

    componentDidMount() {
        $.get("/api/all_runs", function(result) {
            if (result.success != false) {

                var lastFiveRuns = result.slice(0, 5);

                this.setState({
                    runs: lastFiveRuns
                });
            }
        }.bind(this));
    }

    render() {

        var lineChartData = {
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

        var pieChartData =  [
            {
                value: 300,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Red"
            },
            {
                value: 50,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Green"
            },
            {
                value: 100,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Yellow"
            }
        ];

        var barChartdata = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        var radarChartData = {
            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };

        var content = null;

        if (!this.state.runs) {
            content = (
                <div className="row alert alert-warning" role="alert">
                    <div className="col-xs-12">
                        <p className="center-text">
                            You haven't added any run data yet, when you import your first run you'll be able to see information about your fitness here.
                        </p>
                        <div className="center-text">
                            <ModalTrigger modal={<ImportDataModal />} className="btn btn-default navbar-btn margin-left margin-right" buttonText="Import Data" />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <MainNavbar />
                <div className="container">
                    {content}
                    <div className="row">
                        <div className="col-xs-6">
                            <h2>Recent Runs</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        this.state.runs ?
                                            this.state.runs.map( function(run) {
                                                return (
                                                    <tr>
                                                        <td>{window.app.moment(run.start_time * 1000).format(window.app.timeFormat)} {window.app.moment(run.start_time * 1000).format(window.app.dayFormat)}</td>
                                                        <td>{window.app.moment(run.end_time * 1000).format(window.app.timeFormat)} {window.app.moment(run.end_time * 1000).format(window.app.dayFormat)}</td>
                                                        <td><a href={"/run/" + run._id["$oid"]}>View</a></td>
                                                    </tr>
                                                );
                                            }) : ""
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="col-xs-6">
                            <PieChart data={pieChartData} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6">
                            <BarChart data={barChartdata} />
                        </div>
                        <div className="col-xs-6">
                            <RadarChart data={radarChartData} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
