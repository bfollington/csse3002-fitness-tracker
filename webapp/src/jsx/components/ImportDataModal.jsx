/**
 * The import data modal is used to allow the user to upload new data from the
 * device. The device password can be entered and progress can be observed
 * through various prompts.
 */
export class ImportDataModal extends React.Component {

    constructor(props) {
        super.constructor(props);

        // intialise the state
        this.state = {
            importFailed: false,
            importInProgress: false,
            attemptedImport: false
        };
    }

    /**
     * Called when the password field updates
     * @param  Event e
     */
    passwordChange(e) {
        // Store the password in the state for use later
        this.setState({
            password: e.target.value
        });
    }

    /**
     * Called when an import is triggered, POSTs a request to the server
     * and returns either success or failure depending on the device
     * status.
     */
    beginDataImport() {

        // Update the state for display
        this.setState({importInProgress: true, attemptedImport: true});

        // Request w/ password
        $.post("/api/import_data", {password: this.state.password},

            function(result) {

                if (result.success) {
                    // Update the state for display
                    this.setState({importFailed: false});

                    // Wait a second, then refresh the page
                    setTimeout(function() {
                        window.location.reload();
                    }, 500);
                } else {

                    // Display the error message to the user
                    this.setState({
                        importFailed: true,
                        errorMessage: result.error
                    });
                }

                this.setState({importInProgress: false});

            }.bind(this)
        );
    }

    render() {

        // Before an import is started, this is the modal content
        var beforeImportBody = [
            <p>Enter your password to import your run data</p>,
            <div className="form-group">
                <label forName="password">Password</label>
                <input name="password" value={this.state.password} onChange={this.passwordChange.bind(this)} className="form-control" type="password"></input>
            </div>
        ];

        // If an import fails
        var failedImportBody = [
            <div className="alert alert-danger" role="alert"><strong>Import failed</strong>: {this.state.errorMessage}</div>,
            <div className="form-group">
                <label forName="password">Password</label>
                <input name="password" value={this.state.password} onChange={this.passwordChange.bind(this)} className="form-control" type="password"></input>
            </div>
        ];

        // While an import is in progress
        var importInProgress = [
            <div className="alert alert-info" role="alert">Import processing...</div>
        ];

        // If an import succeeds
        var successImportBody = [
            <div className="alert alert-success" role="alert">Import succeeded!</div>
        ];

        var body;

        // State machine for determining which view to use
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
