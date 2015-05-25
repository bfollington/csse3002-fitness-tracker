var ChartJs = require("chart.js");

export class LineChart extends React.Component {
    constructor() {
        this.chart = null;
    }

    componentDidMount() {
        var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");


        this.chart = new ChartJs(context).Line(this.props.data, {});
    }

    componentWillUpdate() {
        console.log("Test");
        this.chart.destroy();

        var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");

        var chart = new ChartJs(context).Line(this.props.data, this.props.opts);
    }

    render() {
        return (
            <div>
                <canvas className="chart" width="400" height="200"></canvas>
            </div>
        );
    }
}
