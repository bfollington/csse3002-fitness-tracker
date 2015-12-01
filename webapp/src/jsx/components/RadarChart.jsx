var ChartJs = require("chart.js");

/**
 * A generic radar chart component using Chartjs
 *
 * Data and options are passed as properties.
 */
export class RadarChart extends React.Component {
    constructor() {

    }

    /**
     * Initialise the chart in the DOM.
     */
    createChart() {
        var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
        this.chart = new ChartJs(context).Radar(this.props.data, this.props.opts);
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

        // Just a simple div with a canvas to render the chart into
        return (
            <div>
                <canvas className="chart" width="400" height="200"></canvas>
            </div>
        );
    }
}
