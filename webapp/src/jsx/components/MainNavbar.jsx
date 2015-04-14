import {Navbar} from "components/Navbar.jsx";
import {ModalTrigger} from "components/ModalTrigger.jsx";
import {ImportDataModal} from "components/ImportDataModal.jsx";

export class MainNavbar extends React.Component {

    importData(e) {
        e.preventDefault();
        console.log(e);


    }

    render() {

        var links = [
            {name: "Dashboard", url: "/", click: function() {}, context: this, button: false},
            {component: <ModalTrigger modal={<ImportDataModal />} className="btn btn-default navbar-btn" buttonText="Import Data" /> }
        ];

        return (
            <Navbar links={links} />
        );
    }
}
