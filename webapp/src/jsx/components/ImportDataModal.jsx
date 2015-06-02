export class ImportDataModal extends React.Component {

    constructor(props) {
        super.constructor(props);

        this.state = {
            importFailed: false,
            importInProgress: false,
            attemptedImport: false
        };
    }

    passwordChange(e) {
        this.setState({
            password: e.target.value
        });
    }

    beginDataImport() {

        this.setState({importInProgress: true, attemptedImport: true});

        $.post("/api/import_data", {password: this.state.password}, function(result) {

            console.log(result);
            if (result.success) {
                this.setState({importFailed: false});

                setTimeout(function() {
                    window.location.reload();
                }, 500);
            } else {
                this.setState({
                    importFailed: true,
                    errorMessage: result.error
                });
            }

            this.setState({importInProgress: false});

        }.bind(this));
    }

    render() {

        var beforeImportBody = [
            <p>Enter your password to import your run data</p>,
            <div className="form-group">
                <label forName="password">Password</label>
                <input name="password" value={this.state.password} onChange={this.passwordChange.bind(this)} className="form-control" type="password"></input>
            </div>
        ];

        var failedImportBody = [
            <div className="alert alert-danger" role="alert"><strong>Import failed</strong>: {this.state.errorMessage}</div>,
            <div className="form-group">
                <label forName="password">Password</label>
                <input name="password" value={this.state.password} onChange={this.passwordChange.bind(this)} className="form-control" type="password"></input>
            </div>
        ];

        var importInProgress = [
            <div className="alert alert-info" role="alert">Import processing...</div>
        ];

        var successImportBody = [
            <div className="alert alert-success" role="alert">Import succeeded!</div>
        ];

        var body;

        if (this.state.importInProgress) {
            body = importInProgress;
        } else {
            if (this.state.attemptedImport) {
                if (this.state.importFailed) {
                    body = failedImportBody;
                } else {
                    body = successImportBody;
                }
            } else {
                body = beforeImportBody;
            }
        }

        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title"><i className="ion-upload" /> Import your Runs</h4>
                        </div>
                        <div className="modal-body">
                            {body}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.beginDataImport.bind(this)} disabled={this.state.importInProgress}>Begin Import</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
