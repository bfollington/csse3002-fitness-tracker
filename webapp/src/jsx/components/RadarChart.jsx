var ChartJs = require("chart.js");

export class RadarChart extends React.Component {
    constructor() {

    }

    componentDidMount() {
        var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");

        var chart = new ChartJs(context).Radar(this.props.data, {});
    }

    render() {
        return (
            <div>
                <canvas className="chart" width="400" height="200"></canvas>
            </div>
        );
    }
}