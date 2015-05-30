export class Map extends React.Component {
    constructor() {

        this.defaultOptsString = "size=600x300&maptype=roadmap";
    }

    getStaticUrl() {
        var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap?" + this.defaultOptsString + "&" + this.centerString + "&" + this.zoomString + "&" + this.runPathString + "&" + this.markerString;

        console.log(staticMapUrl);
        return staticMapUrl;
    }

    computeRunPath(waypoints, bounds) {
        var runPath = [];

        for (var i = 0; i < waypoints.length; i++) {
            var point = new google.maps.LatLng(waypoints[i].lat, waypoints[i].lon);
            runPath.push( point );
            bounds.extend( point );
        }

        return runPath;
    }

    updateRunPathString(runPath) {
        this.runPathString = "path=color:0x0000ff|weight:5|";

        for (var i = 0; i < runPath.length; i++) {
            this.runPathString += runPath[i].A + "," + runPath[i].F;

            if (i < runPath.length - 1) {
                 this.runPathString += "|";
            }
        }
    }

    updateMarkerString(start, end) {
        this.markerString = "markers=color:blue|" + start.A + "," + start.F + "|" + end.A + "," + end.F;
    }

    mapZoomHandler(map, e) {
        this.zoomString = "zoom=" + map.zoom;
    }

    mapCenterHandler(map, e) {
        this.centerString = "center=" + map.center.A + "," + map.center.F;
    }

    initStaticMapStrings() {
        this.defaultOptsString = "size=600x300&maptype=roadmap";
    }

    createRunPathPolyline(map, waypoints, runPath) {
        var runPathPolyLine;

        for (var i = 0; i < waypoints.length - 1; i++) {

            var dx = parseFloat(waypoints[i].lat) - parseFloat(waypoints[i + 1].lat);
            var dy = parseFloat(waypoints[i].lon) - parseFloat(waypoints[i + 1].lon);
            var dist = Math.sqrt(dx * dx  + dy * dy) * 1000;
            dist *= 500;
            if ( dist > 230 ) {
                dist = 230;
            }
            if ( dist < 20 ) {
                dist = 20;
            }
            console.log( dist );
            var r, g, b;
            r = parseInt((255 - dist));
            g = parseInt((dist));
            b = 20;
            console.log( r, g, b );

            runPathPolyLine = new google.maps.Polyline({
                path: [runPath[i], runPath[i + 1]],
                geodesic: true,
                strokeColor: 'rgba(' + r + ', ' + g + ', ' + b + ', 1)',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            runPathPolyLine.setMap(map);
        }
    }

    placeMarkers(map, waypoints, runPath) {
        var startImage = '/img/start.png';
        var endImage = '/img/end.png';
        var nodeImage = '/img/blank.png';
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

    componentDidMount() {
        var bounds = new google.maps.LatLngBounds();
        var runPath = this.computeRunPath(this.props.waypoints, bounds);

        var mapOptions = {
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        var map = new google.maps.Map($(React.findDOMNode(this)).find(".map-canvas")[0], mapOptions);
        this.map = map;
        map.fitBounds(bounds);

        google.maps.event.addListenerOnce(map, "zoom_changed", this.mapZoomHandler.bind(this, map));
        google.maps.event.addListenerOnce(map, "center_changed", this.mapCenterHandler.bind(this, map));

        this.updateMarkerString(runPath[0], runPath[runPath.length - 1]);
        this.updateRunPathString(runPath);

        this.createRunPathPolyline(map, this.props.waypoints, runPath);
        this.placeMarkers(map, this.props.waypoints, runPath);
    }

    render() {
        return (
            <div>
                <div className="map-canvas"></div>
            </div>
        );
    }
}
