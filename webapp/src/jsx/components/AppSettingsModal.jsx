export class AppSettingsModal extends React.Component {

    constructor(props) {
        super.constructor(props);

        this.state = {
            saveSettingsInProgress: false,
            weight: 0,
            height: 0,
            gender: "other",
            age: 0
        };
    }

    componentDidMount() {

        $(React.findDOMNode(this)).on("shown.bs.modal", this.shown.bind(this));
    }

    shown(e) {
        $.get("/api/settings", function(result) {

            if (result.success != false) {
                console.log(result);

                this.setState({
                    gender: result.gender,
                    weight: result.weight,
                    height: result.height,
                    age: result.age
                });
            }

        }.bind(this));
    }

    beginSaveSettings() {

        this.setState({saveSettingsInProgress: true});

        var params = {
            weight: this.state.weight,
            height: this.state.height,
            age: this.state.age,
            gender: this.state.gender
        };

        $.post("/api/update_settings", params, function(result) {
            console.log(result);

            this.setState({saveSettingsInProgress: false});

            $(React.findDOMNode(this)).modal("hide");

        }.bind(this));
    }

    // kg
    weightChanged(e) {
        this.setState({weight: parseInt(e.target.value)});
    }

    // cm
    heightChanged(e) {
        this.setState({height: parseInt(e.target.value)});
    }

    // string
    genderChanged(e) {
        this.setState({gender: e.target.value});
    }

    // years
    ageChanged(e) {
        this.setState({age: parseInt(e.target.value)});
    }

    getForm() {
        return (
            <div className="form-group">

                <label forName="weight">Weight (kg)</label>
                <input name="weight" value={this.state.weight} type="number" onChange={this.weightChanged.bind(this)} className="form-control"></input>

                <label forName="height">Height (cm)</label>
                <input name="height" value={this.state.height} type="number" onChange={this.heightChanged.bind(this)} className="form-control"></input>

                <label forName="age">Age (years)</label>
                <input name="age" value={this.state.age} type="number" onChange={this.ageChanged.bind(this)} className="form-control"></input>

                <label forName="gender">Gender</label>
                <select className="form-control" value={this.state.gender} onChange={this.genderChanged.bind(this)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
        );
    }

    render() {

        var beforeImportBody = [
            <p>Please configure the application settings, this information is used to calculate the kilojoules you burn on each run.</p>,
            this.getForm()
        ];

        var body = beforeImportBody;

        return (
            <div className="modal fade" id="settings_modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title"><i className="ion ion-gear-a"></i> Application Settings</h4>
                        </div>
                        <div className="modal-body">
                            {body}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.beginSaveSettings.bind(this)} disabled={this.state.saveSettingsInProgress}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
