import {ModalTrigger} from "components/ModalTrigger.jsx";
import {ShareRunModal} from "components/ShareRunModal.jsx";
import {MainNavbar} from "components/MainNavbar.jsx";
import {Map} from "components/Map.jsx";
import {LineChart} from "components/LineChart.jsx";

export class RunDataPage extends React.Component {
    constructor() {
        this.state = {
            run: false,
            chartData: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
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
                scaleLabel: function(value) {
                    return value.value + " km/hr"
                },
                tooltipTemplate: function(value) {
                    return ( (value.value).toFixed( 1 ) + " km/hr" )
                }
            }
        };
    }

    componentDidMount() {
        $.get("/api/run/" + this.props.runId, function(result) {

            if (result.success != false) {
                this.setState({
                    run: result,
                });

                var data = this.state.chartData;
                var labels = [];
                var speeds = [];

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

                let interval = parseInt( result.speed_graph.x.length / 10 );

                for (var i = 0; i < result.speed_graph.x.length; i++) {
                    let label = "";
                    if ( i % interval == 0 ) {
                        label = pretty_print_time( parseInt( result.speed_graph.x[i] ) );
                        console.log( label );
                    }
                    labels.push(label);
                    speeds.push(result.speed_graph.y[i] * 60 * 60 / 1000); // to kmph
                }

                data.labels = labels;
                data.datasets[0].data = speeds;

                this.setState({chartData: data});
            }

        }.bind(this));
    }

    shareRun(e) {
        var mapUrl = this.refs.map.getStaticUrl();
        var callback = this.imgurUpload.bind(this);

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

    imgurUpload(data) {
        console.log(data);
        this.setState({mapUrl: data["data"]["link"], sharingRun: true});
    }

    render() {

        var body = (
            <div className="container">
                <div className="row">
                    <p>This run does not exist.</p>
                </div>
            </div>
        );

        var modal = <ShareRunModal ref="modal" imageUrl={this.state.mapUrl} />;
        if (!this.state.sharingRun) {
            modal = null;
        }

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

        return (
            <div>
                <MainNavbar />
                {body}
            </div>
        );
    }
}
