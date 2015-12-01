import {FacebookShareButton, TwitterShareButton} from "components/SocialSharing.jsx";

/**
 * A modal displayed when a user opts to share their run to either Facebook
 * or Twitter.
 */
export class ShareRunModal extends React.Component {


    componentDidMount() {

        // Show the modal when the component is created
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
                            {/* Display image and sharing controls */}
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
