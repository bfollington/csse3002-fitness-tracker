import {Navbar} from "components/Navbar.jsx";
import {ModalTrigger} from "components/ModalTrigger.jsx";
import {UploadDataButton} from "components/UploadDataButton.jsx";
import {ImportDataModal} from "components/ImportDataModal.jsx";

/**
 * The main navigation bar displayed at the top of every page within the
 * application.
 */
export class MainNavbar extends React.Component {

    importData(e) {
        e.preventDefault();
        console.log(e);


    }

    render() {

        // Pass the navigation array into the generic navbar
        var links = [
            {
                name: "Dashboard",
                icon: "ion-ios-home",
                url: "/dashboard",
                click: function() {},
                context: this,
                button: false
            },
            {
                name: "Run History",
                icon: "ion-stats-bars",
                url: "/history",
                click: function() {},
                context: this,
                button: false
            }
        ];

        return (
            <Navbar links={links} />
        );
    }
}
