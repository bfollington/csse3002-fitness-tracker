import {Navbar} from "components/Navbar.jsx";
import {ModalTrigger} from "components/ModalTrigger.jsx";
import {UploadDataButton} from "components/UploadDataButton.jsx";
import {ImportDataModal} from "components/ImportDataModal.jsx";

export class MainNavbar extends React.Component {

    importData(e) {
        e.preventDefault();
        console.log(e);


    }

    render() {

        var links = [
            {name: "Dashboard", url: "/dashboard", click: function() {}, context: this, button: false},
            {name: "Run History", url: "/history", click: function() {}, context: this, button: false},
            {component: <ModalTrigger modal={<ImportDataModal />} button={true} className="btn btn-default navbar-btn" buttonText={<UploadDataButton />} /> }
        ];

        return (
            <Navbar links={links} />
        );
    }
}
