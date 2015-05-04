export class ModalTrigger extends React.Component {
    triggerModal(e) {
        e.preventDefault();

        React.render(this.props.modal, $('#modal_mount')[0]);
        $('#modal_mount').find(".modal").modal("show");
    }

    render() {
        return(
            <div className="inline-block">
                <button className={this.props.className} onClick={this.triggerModal.bind(this)}>{this.props.buttonText}</button>
            </div>
        );
    }
}
