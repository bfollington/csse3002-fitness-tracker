export class ModalTrigger extends React.Component {
    triggerModal(e) {
        e.preventDefault();

        React.render(this.props.modal, $('#modal_mount')[0]);
        $('#modal_mount').find(".modal").modal("show");
    }

    render() {

        var inner;

        if (this.props.button) {
            inner = <button className={this.props.className} onClick={this.triggerModal.bind(this)}>{this.props.buttonText}</button>
        } else {
            inner = <a className={this.props.className} href="#" onClick={this.triggerModal.bind(this)}>{this.props.buttonText}</a>
        }

        return(
            <div className="inline-block">
                {inner}
            </div>
        );
    }
}
