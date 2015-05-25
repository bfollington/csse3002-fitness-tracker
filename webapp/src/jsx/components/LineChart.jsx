var ChartJs = require("chart.js");

export class LineChart extends React.Component {
    constructor() {
        this.chart = null;
    }

    createChart() {
        var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
        this.chart = new ChartJs(context).Line(this.props.data, this.props.opts);
    }

    componentDidMount() {
        this.createChart();
    }

    componentWillUpdate() {
        this.chart.destroy();
        this.createChart();
    }

    render() {
        return (
            <div>
                <canvas className="chart" width="400" height="200"></canvas>
            </div>
        );
    }
}
