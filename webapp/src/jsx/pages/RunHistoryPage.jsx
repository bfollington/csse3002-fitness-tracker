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
        this.state = {
            runs: null
        }
    }

    componentDidMount() {
        this.updateRuns();
    }

    updateRuns() {
        $.get("/api/all_runs", function(result) {
            if (result.success != false) {
                this.setState({
                    runs: result
                });
            }
        }.bind(this));
    }

    deleteRun(run, e) {
        // this is bound to the run instance

        if (confirm("Are you sure you want to delete this run?")) {
            console.log(run);

            $.get("/api/delete_run/" + run._id["$oid"], function(result) {

                if (result.success != false) {

                    this.updateRuns();

                } else {
                    console.error("Could not delete run.");
                }
            }.bind(this));
        } else {

        }
    }

    render() {

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
                                        this.state.runs ?
                                            this.state.runs.map( function(run) {
                                                return (
                                                    <tr>
                                                        <td>{window.app.moment(run.start_time * 1000).format(window.app.timeFormat)} {window.app.moment(run.start_time * 1000).format(window.app.dayFormat)}</td>
                                                        <td>{window.app.moment(run.end_time * 1000).format(window.app.timeFormat)} {window.app.moment(run.end_time * 1000).format(window.app.dayFormat)}</td>
                                                        <td>
                                                            <a className="btn btn-default" href={"/run/" + run._id["$oid"]}>View</a> <button className="btn btn-default" onClick={this.deleteRun.bind(this, run)}>Delete</button>
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
