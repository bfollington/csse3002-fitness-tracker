import {Body} from "components/Body.jsx";
import {LineChart} from "components/LineChart.jsx";
import {BarChart} from "components/BarChart.jsx";
import {RadarChart} from "components/RadarChart.jsx";
import {PieChart} from "components/PieChart.jsx";
import {MainNavbar} from "components/MainNavbar.jsx";
import {ModalTrigger} from "components/ModalTrigger.jsx";
import {ImportDataModal} from "components/ImportDataModal.jsx";

export class RunHistoryPage extends React.Component {
    constructor() {
        /* Reset the run state. */
        this.state = {
            runs: null
        }
    }

    componentDidMount() {
        /* Fetch the run data from the server on mount. */
        this.updateRuns();
    }

    /*
     * Get all existing runs from the server, and add them to the state.
     */
    updateRuns() {
        $.get("/api/all_runs", function(result) {
            if (result.success != false) {
                this.setState({
                    runs: result
                });
            }
        }.bind(this));
    }

    /*
     * Callback to delete a specified run from the server.
     * Accepts a run object.
     */
    deleteRun(run, e) {
        /*
         * Ask the user for confirmation to delete the run.
         */
        if (confirm("Are you sure you want to delete this run?")) {
            /* If the user confirms, send the request to the server. */
            $.get("/api/delete_run/" + run._id["$oid"], function(result) {
                if (result.success != false) {
                    /* If successful, update the runs listing. */
                    this.updateRuns();
                } else {
                    console.error("Could not delete run.");
                }
            }.bind(this));
        } else {
            /* Pass if the user declines. */
        }
    }

    render() {
        /* Render the existing runs in a body table. */
        return (
            <div>
                <MainNavbar />
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <h2>Run History</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        /* Display each of the runs in a row of the table. */
                                        this.state.runs ?
                                            this.state.runs.map( function(run) {
                                                return (
                                                    <tr>
                                                        <td>{window.app.moment(run.start_time * 1000).format(window.app.timeFormat)} {window.app.moment(run.start_time * 1000).format(window.app.dayFormat)}</td>
                                                        <td>{window.app.moment(run.end_time * 1000).format(window.app.timeFormat)} {window.app.moment(run.end_time * 1000).format(window.app.dayFormat)}</td>
                                                        <td>
                                                            <a className="btn btn-default" href={"/run/" + run._id["$oid"]}><i className="ion ion-eye" /></a> <button className="btn btn-default" onClick={this.deleteRun.bind(this, run)}><i className="ion ion-trash-b" /></button>
                                                        </td>
                                                    </tr>
                                                );
                                            }.bind(this)) : ""
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
