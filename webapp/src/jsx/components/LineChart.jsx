var ChartJs = require("chart.js");

/**
 * A generic line chart component using Chartjs
 *
 * Data and options are passed as properties.
 */
export class LineChart extends React.Component {
    constructor() {
        this.chart = null;
    }

    /**
     * Initialise the chart in the DOM.
     */
    createChart() {
        var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
        this.chart = new ChartJs(context).Line(this.props.data, this.props.opts);
    }

    componentDidMount() {
        // Create the chart on mount
        this.createChart();
    }

    componentWillUpdate() {
        // If the data updates, refresh the chart by recreating it
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
