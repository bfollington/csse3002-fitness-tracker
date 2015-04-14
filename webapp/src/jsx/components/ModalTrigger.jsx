export class ModalTrigger extends React.Component {
    triggerModal(e) {
        e.preventDefault();

        $(React.findDOMNode(this)).find(".modal").modal("show");
    }

    render() {
        return(
            <span>
                <button className={this.props.className} onClick={this.triggerModal.bind(this)}>{this.props.buttonText}</button>
                {this.props.modal}
            </span>
        );
    }
}
