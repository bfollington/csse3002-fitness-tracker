export class Map extends React.Component {
    constructor() {

    }

    componentDidMount() {

        var runPath = [];
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < this.props.waypoints.length; i++) {
            var point = new google.maps.LatLng(this.props.waypoints[i].lat, this.props.waypoints[i].lon);
            runPath.push( point );
            bounds.extend( point );
        }

        var mapOptions = {
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        var map = new google.maps.Map($(React.findDOMNode(this)).find(".map-canvas")[0], mapOptions);
        map.fitBounds(bounds);

        for (var i = 0; i < this.props.waypoints.length - 1; i++) {

            var dx = parseFloat(this.props.waypoints[i].lat) - parseFloat(this.props.waypoints[i + 1].lat);
            var dy = parseFloat(this.props.waypoints[i].lon) - parseFloat(this.props.waypoints[i + 1].lon);
            var dist = Math.sqrt(dx * dx  + dy * dy) * 1000;

            var r, g, b;
            r = parseInt(255 * dist);
            g = parseInt(255 * (1 - dist));
            b = 20;

            var runPathPolyLine = new google.maps.Polyline({
                path: [runPath[i], runPath[i + 1]],
                geodesic: true,
                strokeColor: 'rgba(' + r + ', ' + g + ', ' + b + ', 1)',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            runPathPolyLine.setMap(map);
        }

        var startImage = '/img/start.png';
        var endImage = '/img/end.png';
        var nodeImage = '/img/blank.png'; //'/img/node.png';
        var icon;

        for (var i = 0; i < runPath.length; i++) {
            if (i == 0) {
                icon = startImage;
            } else if (i == runPath.length - 1) {
                icon = endImage;
            } else {
                icon = nodeImage;
            }

            let wp = this.props.waypoints[i];

            var marker = new google.maps.Marker({
                position: runPath[i],
                map: map,
                title: 'Title Test',
                icon: icon
            });

            (function (marker) {
                var infowindow = new google.maps.InfoWindow({
                    content: "" + window.app.moment(wp.time * 1000).format(window.app.timeFormat)
                });
                google.maps.event.addListener(marker, 'mouseover', function() {
                    infowindow.open(map, marker);
                });

                google.maps.event.addListener(marker, 'mouseout', function() {
                    infowindow.close(map, marker);
                });
            })(marker);
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
