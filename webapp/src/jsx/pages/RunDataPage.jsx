import {Body} from "components/Body.jsx";
import {ModalTrigger} from "components/ModalTrigger.jsx";
import {ShareRunModal} from "components/ShareRunModal.jsx";
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
                        <h1>Your Run on {window.app.moment(this.state.run.start_time * 1000).format(window.app.dayFormat)}</h1>
                        <Map ref="map" waypoints={this.state.run.waypoints} />
                        {modal}
                        <button onClick={this.shareRun.bind(this)}>Share Run</button>
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
