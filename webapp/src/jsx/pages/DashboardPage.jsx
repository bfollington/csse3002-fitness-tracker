import {Body} from "components/Body.jsx";
import {LineChart} from "components/LineChart.jsx";
import {BarChart} from "components/BarChart.jsx";
import {RadarChart} from "components/RadarChart.jsx";
import {PieChart} from "components/PieChart.jsx";
import {MainNavbar} from "components/MainNavbar.jsx";
import {ModalTrigger} from "components/ModalTrigger.jsx";
import {ImportDataModal} from "components/ImportDataModal.jsx";
import {FacebookShareButton, TwitterShareButton} from "components/SocialSharing.jsx";

export class DashboardPage extends React.Component {
    constructor() {
        this.state = {
            runs: null,
            speedGraph: {
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: "My Second dataset",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: []
                        }
                    ]
                },
                opts: {
                    scaleLabel: function( val ) {
                        return val.value + " km/h"
                    }
                }
            },
            distanceGraph: {
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: "My Second dataset",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: []
                        }
                    ]
                },
                opts: {
                    scaleLabel: function( val ) {
                        return val.value + " m"
                    }
                }
            }
        }
    }

    componentDidMount() {
        var date = (new Date());
        date.setDate(date.getDate() - 7);
        date = date.toISOString().substring(0, 10);
        console.log(date);

        $.get("/api/runs_since_date/" + date, function(result) {
            if (result.success != false) {

                console.log(result);
                var speedGraph = this.state.speedGraph;
                var distanceGraph = this.state.distanceGraph;

                this.setState({
                    runs: result.runs
                });

                speedGraph.data.labels = [];
                speedGraph.data.datasets[0].data = [];
                distanceGraph.data.labels = [];
                distanceGraph.data.datasets[0].data = [];

                let counts = [0,0,0,0,0,0,0];
                let speeds = [0,0,0,0,0,0,0];
                let distances = [0,0,0,0,0,0,0];

                let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                for (var i = 0; i < result.runs.length; i++) {
                    let run = result.runs[i];
                    let moment = window.app.moment( run.start_time * 1000 );
                    let day = moment.weekday();

                    counts[day]++;
                    speeds[day] += run.average_speed;
                    distances[day] += run.distance;
                }


                for (var i = 0; i < 7; i++) {

                    let run = result.runs[i];
                    speedGraph.data.labels.push(weekdays[i]);
                    let speed = 0;
                    if ( counts[i] > 0 ) {
                        speed = (speeds[i] / counts[i]) * 60 * 60 / 1000;
                    }
                    speed = speed.toFixed(2);
                    speedGraph.data.datasets[0].data.push(speed);

                    distanceGraph.data.labels.push(weekdays[i]);
                    let distance = 0;
                    if ( counts[i] > 0 ) {
                        distance = distances[i];
                    }
                    distance = distance.toFixed(2);
                    distanceGraph.data.datasets[0].data.push(distance);
                }

                this.setState({
                    speedGraph: speedGraph,
                    distanceGraph: distanceGraph,
                });
            }
        }.bind(this));
    }

    render() {

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

        if (!this.state.runs || this.state.runs.length == 0) {
            content = (
                <div className="row alert alert-warning" role="alert">
                    <div className="col-xs-12">
                        <p className="center-text">
                            You haven't added any run data this week, when you import a new run you'll be able to see information about your fitness here.
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
                        <div className="col-xs-12">
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
                                                        <td><a className="btn btn-default" href={"/run/" + run._id}>View</a></td>
                                                    </tr>
                                                );
                                            }) : ""
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6">
                            <h2>Average Speed Over The Past Week</h2>
                            <LineChart data={this.state.speedGraph.data} opts={this.state.speedGraph.opts} />
                        </div>
                        <div className="col-xs-6">
                            <h2>Distance Covered Over The Past Week</h2>
                            <LineChart data={this.state.distanceGraph.data} opts={this.state.distanceGraph.opts} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
