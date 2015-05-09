export class ImportDataModal extends React.Component {

    beginDataImport() {

        $.post("/api/import_data", {}, function(result) {

            console.log(result);

        }.bind(this));
    }

    render() {
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">Connect to Device</h4>
                        </div>
                        <div className="modal-body">
                            <p>Import your data...</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.beginDataImport.bind(this)}>Begin Import</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
