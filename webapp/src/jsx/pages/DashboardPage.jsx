import {Body} from "components/Body.jsx";
import {LineChart} from "components/LineChart.jsx";
import {BarChart} from "components/BarChart.jsx";
import {RadarChart} from "components/RadarChart.jsx";
import {PieChart} from "components/PieChart.jsx";
import {MainNavbar} from "components/MainNavbar.jsx";
import {ModalTrigger} from "components/ModalTrigger.jsx";
import {ImportDataModal} from "components/ImportDataModal.jsx";
import {FacebookShareButton, TwitterShareButton} from
        "components/SocialSharing.jsx";
import {UploadDataButton} from "components/UploadDataButton.jsx";

/*
 * Renders the main dashboard for the application.
 */
export class DashboardPage extends React.Component {
    constructor() {
        /* Initialise the state of the page. */
        this.state = {
            runs: null,
            /* Graph to show the average speed each day of the last week. */
            speedGraph: {
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: "Speed",
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
                /* Show the units of km/h for data points. */
                opts: {
                    scaleLabel: function( val ) {
                        return val.value + " km/h"
                    }
                }
            },
            /* Graph to show the total distance run each day of the last week. */
            distanceGraph: {
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: "Distance",
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
                /* Show the units of m for data points. */
                opts: {
                    scaleLabel: function( val ) {
                        return val.value + " m"
                    }
                }
            }
        }
    }

    componentDidMount() {
        /* Request all runs in the last week from the server. */
        var date = (new Date());
        date.setDate(date.getDate() - 7);
        date = date.toISOString().substring(0, 10);

        $.get("/api/runs_since_date/" + date, function(result) {
            if (result.success != false) {
                /*
                 * Take a local copy of the speed and distance graphs to
                 * modify and return to the props.
                 */
                var speedGraph = this.state.speedGraph;
                var distanceGraph = this.state.distanceGraph;

                /* Update the number of runs stored. */
                this.setState({
                    runs: result.runs
                });

                /* Reset the data stored in both graphs. */
                speedGraph.data.labels = [];
                speedGraph.data.datasets[0].data = [];
                distanceGraph.data.labels = [];
                distanceGraph.data.datasets[0].data = [];

                /* Reset the data to display on both graphs. */
                let counts = [0,0,0,0,0,0,0];
                let speeds = [0,0,0,0,0,0,0];
                let distances = [0,0,0,0,0,0,0];

                /* Helper array used to generate axis labels. */
                let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday",
                        "Thursday", "Friday", "Saturday"];

                /*
                 * Iterate through the runs returned, adding the data to the
                 * speeds and distances arrays for the correct day of the week.
                 * Also increments the count, to be used for averages.
                 */
                for (var i = 0; i < result.runs.length; i++) {
                    let run = result.runs[i];
                    let moment = window.app.moment( run.start_time * 1000 );
                    let day = moment.weekday();

                    counts[day]++;
                    speeds[day] += run.average_speed;
                    distances[day] += run.distance;
                }

                /* Record the current day of the week, from 0 to 6. */
                let currentDay = window.app.moment().weekday();

                /* For each day, add a data point to the graph. */
                for (var i = 0; i < 7; i++) {
                    /*
                     * Add in the current offset to display the current day as
                     * the rightmost data point.
                     */
                    let day = (currentDay + i + 1) % 7;

                    /* Add the label to the speed graph. */
                    speedGraph.data.labels.push(weekdays[day]);
                    /* Determine the average speed for that day. */
                    let speed = 0;
                    if ( counts[day] > 0 ) {
                        speed = (speeds[day] / counts[day]) * 60 * 60 / 1000;
                    }
                    /* Round to two decimal places. */
                    speed = speed.toFixed(2);
                    /* Push the average speed to the speed graph dataset. */
                    speedGraph.data.datasets[0].data.push(speed);

                    /* Add the label to the distance graph. */
                    distanceGraph.data.labels.push(weekdays[day]);
                    /* Determine the total distance for that day. */
                    let distance = 0;
                    if ( counts[day] > 0 ) {
                        distance = distances[day];
                    }
                    /* Round to two decimal places. */
                    distance = distance.toFixed(2);
                    /* Push the total distance to the distance graph dataset. */
                    distanceGraph.data.datasets[0].data.push(distance);
                }

                /* Update the state with the generated graphs. */
                this.setState({
                    speedGraph: speedGraph,
                    distanceGraph: distanceGraph,
                });
            }
        }.bind(this));
    }

    render() {

        var content = null;

        /*
         * Show a special alert prompting the user to import a run if there
         * are no runs stored in the database.
         */

        if (!this.state.runs || this.state.runs.length == 0) {
            content = (
                <div className="row alert alert-warning" role="alert">
                    <div className="col-xs-12">
                        <p className="center-text">
                            You haven't added any run data this week, when you import a new run you'll be able to see information about your fitness here.
                        </p>
                        <div className="center-text">
                            <ModalTrigger modal={<ImportDataModal />} button={true} className="btn btn-default navbar-btn margin-left margin-right" buttonText={<UploadDataButton />} />
                        </div>
                    </div>
                </div>
            );
        }

        /*
         * Render the main content of the dashboard page.
         */
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
                                        /* Display each run in the last week as a row of the table. */
                                        this.state.runs ?
                                            this.state.runs.map( function(run) {
                                                return (
                                                    <tr>
                                                        <td>{window.app.moment(run.start_time * 1000).format(window.app.timeFormat)} {window.app.moment(run.start_time * 1000).format(window.app.dayFormat)}</td>
                                                        <td>{window.app.moment(run.end_time * 1000).format(window.app.timeFormat)} {window.app.moment(run.end_time * 1000).format(window.app.dayFormat)}</td>
                                                        <td><a className="btn btn-default" href={"/run/" + run._id}><i className="ion ion-eye" /></a></td>
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
