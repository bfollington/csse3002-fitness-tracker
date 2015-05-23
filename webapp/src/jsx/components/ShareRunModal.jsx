import {FacebookShareButton, TwitterShareButton} from "components/SocialSharing.jsx";

export class ShareRunModal extends React.Component {

    beginDataImport() {

        $.post("/api/import_data", {}, function(result) {

            console.log(result);

        }.bind(this));
    }

    componentDidMount() {

        $(React.findDOMNode(this)).modal("show");

    }

    render() {
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">Share Your Run</h4>
                        </div>
                        <div className="modal-body">
                            <img src={this.props.imageUrl} width="100%"/>
                            <br />
                            <FacebookShareButton url={this.props.imageUrl} />
                            <TwitterShareButton url={this.props.imageUrl} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
