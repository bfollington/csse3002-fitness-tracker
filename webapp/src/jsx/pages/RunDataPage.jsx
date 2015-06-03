import {ModalTrigger} from "components/ModalTrigger.jsx";
import {ShareRunModal} from "components/ShareRunModal.jsx";
import {MainNavbar} from "components/MainNavbar.jsx";
import {Map} from "components/Map.jsx";
import {LineChart} from "components/LineChart.jsx";

/*
 * Renders the page to display the summary of a run.
 */
export class RunDataPage extends React.Component {
    constructor() {
        /* Initialise the default state of the page. */
        this.state = {
            run: false,
            /* Initialise the run speed graph. */
            chartData: {
                labels: ["January", "February", "March", "April", "May",
                        "June", "July"],
                datasets: [
                    {
                        label: "Speed",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: [65, 59, 80, 81, 56, 55, 40]
                    }
                ]
            },
            chartOpts: {
                scaleShowGridLines : false,
                datasetFill : true,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: true,
                showTooltips: true,
                pointHitDetectionRadius : 1,
                /* Display labels in km/h. */
                scaleLabel: function(value) {
                    return value.value + " km/h"
                },
                /* Show the tooltip in km/h to 1 decimal place. */
                tooltipTemplate: function(value) {
                    return ( (value.value).toFixed( 1 ) + " km/h" )
                }
            }
        };
    }

    componentDidMount() {
        /* Fetch the data for the run when the component is mounted. */
        $.get("/api/run/" + this.props.runId, function(result) {

            if (result.success != false) {
                this.setState({
                    run: result,
                });

                /* Reset the chart data. */
                var data = this.state.chartData;
                var labels = [];
                var speeds = [];

                /*
                 * Helper function to print a time in the form #h #m.
                 */
                function pretty_print_time( seconds ) {
                    let minutes = Math.floor( seconds / 60 ) % 60;
                    let hours = Math.floor( seconds / 3600 ) % 24;

                    let str = "";
                    if ( hours > 0 ) {
                        str += hours + "h ";
                    }
                    str += minutes + "m";
                    return str;
                }

                /*
                 * Set the sample interval to display 10 labels on the x
                 * axis.
                 */
                let interval = parseInt( result.speed_graph.x.length / 10 );

                /* Iterate through the data points. */
                for (var i = 0; i < result.speed_graph.x.length; i++) {
                    /* Default to no label. */
                    let label = "";
                    /*
                     * If this item is one of the 10 specified for a label,
                     * set it to the pretty time of the current point.
                     */
                    if ( i % interval == 0 ) {
                        let time_sec = parseInt(result.speed_graph.x[i]);
                        label = pretty_print_time(time_sec);
                    }
                    labels.push(label);
                    /* Add the speed in km/h to the data set. */
                    speeds.push(result.speed_graph.y[i] * 60 * 60 / 1000); // to km/h
                }

                /* Update the chart. */
                data.labels = labels;
                data.datasets[0].data = speeds;
                this.setState({chartData: data});
            }

        }.bind(this));
    }

    /*
     * Handle a run share event by posting an image of the current run to
     * imgur.
     */
    shareRun(e) {
        /* Get a URL for the current map. */
        var mapUrl = this.refs.map.getStaticUrl();
        var callback = this.imgurUpload.bind(this);

        /* Upload the image to imgur. */
        $.ajax({
            type: "POST",
            url: "https://api.imgur.com/3/image",
            headers: {
                'Authorization': 'Client-ID d8f59039bdb9fad'
            },
            data: {
                image: mapUrl
            },
            success: callback
        });
    }

    /*
     * Callback for when the upload is complete.
     */
    imgurUpload(data) {
        this.setState({mapUrl: data["data"]["link"], sharingRun: true});
    }

    render() {

        /* Set the default body to indicate that the run does not exist. */
        var body = (
            <div className="container">
                <div className="row">
                    <p>This run does not exist.</p>
                </div>
            </div>
        );

        /* Show the sharing modal if an image upload was successful. */
        var modal = <ShareRunModal ref="modal" imageUrl={this.state.mapUrl} />;
        if (!this.state.sharingRun) {
            modal = null;
        }

        /* Override the body if a run was found. */
        if (this.state.run) {
            body = (
                <div className="container">
                    <div className="row">
                        <h1 className="full-width">
                            Your Run <small>{window.app.moment(this.state.run.start_time * 1000).format(window.app.dayFormat)}</small>
                            <button className="btn btn-default float-right" onClick={this.shareRun.bind(this)}>Share Run</button>
                        </h1>
                    </div>
                    <div className="row margin-top">
                        <div className="col-md-3 center-text"><h3>Total Distance</h3> {Math.round(this.state.run.distance)} m</div>
                        <div className="col-md-3 center-text"><h3>Average Speed</h3> {(this.state.run.average_speed * 60 * 60 / 1000).toFixed(2)} km/h</div>
                        <div className="col-md-3 center-text"><h3>Duration</h3> { parseInt(this.state.run.duration / 60) } mins {this.state.run.duration % 60} seconds</div>
                        <div className="col-md-3 center-text"><h3>Kilojoules Burned</h3>{Math.round(this.state.run.kilojoules)} kj</div>
                    </div>
                    <hr />
                    <div className="row">
                        <Map ref="map" waypoints={this.state.run.waypoints} />
                        {modal}
                    </div>

                    <hr />
                    <div className="row">
                        <div className="col-xs-12 center-text">
                            <h3>Your Speed Breakdown</h3>
                            <LineChart data={this.state.chartData} opts={this.state.chartOpts} width={1140} height={240} />
                        </div>
                    </div>
                </div>
            );
        }

        /* Return the content of the page. */
        return (
            <div>
                <MainNavbar />
                {body}
            </div>
        );
    }
}
