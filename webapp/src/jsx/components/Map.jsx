export class Map extends React.Component {
    constructor() {

    }

    componentDidMount() {

        var runPath = [];

        for (var i = 0; i < this.props.waypoints.length; i++) {
            runPath.push( new google.maps.LatLng(this.props.waypoints[i].lat, this.props.waypoints[i].lon) );
        }

        var mapOptions = {
            zoom: 30,
            center: runPath[0],
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        var map = new google.maps.Map($(React.findDOMNode(this)).find(".map-canvas")[0], mapOptions);

        var runPathPolyLine = new google.maps.Polyline({
            path: runPath,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        runPathPolyLine.setMap(map);

        var startImage = '/img/start.png';
        var endImage = '/img/end.png';
        var nodeImage = '/img/node.png';
        var icon;

        for (var i = 0; i < runPath.length; i++) {
            if (i == 0) {
                icon = startImage;
            } else if (i == runPath.length - 1) {
                icon = endImage;
            } else {
                icon = nodeImage;
            }

            new google.maps.Marker({
                position: runPath[i],
                map: map,
                title: 'Title Test',
                icon: icon
            });
        }

    }

    render() {
        return (
            <div>
                <div className="map-canvas"></div>
            </div>
        );
    }
}
