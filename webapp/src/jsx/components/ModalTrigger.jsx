/**
 * Modal triggers can be used to open a Bootstrap modal on click of either
 * a link or button.
 */
export class ModalTrigger extends React.Component {

    /**
     * Trigger the embedded modal within the component.
     *
     * This is called by a click usually.
     */
    triggerModal(e) {
        e.preventDefault();

        React.render(this.props.modal, $('#modal_mount')[0]);
        $('#modal_mount').find(".modal").modal("show");
    }

    render() {

        var inner;

        // Render either a button or a link depending on the prop value
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
