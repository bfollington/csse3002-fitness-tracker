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
                <canvas className="chart center-chart" width={this.props.width} height={this.props.height}></canvas>
            </div>
        );
    }
}

LineChart.defaultProps = {
    width: 360,
    height: 180
}
