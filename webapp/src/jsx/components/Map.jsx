
/**
 * The map component is used on the run display page, it is responsible
 * for displaying the path a user took during their journey with
 * appropriate speed colour coding.
 *
 * The component can also generate a static image URL for sharing purposes.
 */
export class Map extends React.Component {
    constructor() {

        // Used in static url generation
        this.initStaticMapStrings();
    }

    /**
     * Generate the maps static URL for the currently displayed map
     * @return string Map URL
     */
    getStaticUrl() {
        var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap?" +
            this.defaultOptsString + "&" +
            this.centerString + "&" +
            this.zoomString + "&" +
            this.runPathString + "&" +
            this.markerString;

        return staticMapUrl;
    }

    /**
     * Translate our internal waypoint format into the Google maps
     * concept of latlon pairs.
     * @param  Array waypoints List of coordinate pairs describing the run
     * @param  Bounds bounds    The map bounds
     * @return Array A list of Google formatted run points
     */
    computeRunPath(waypoints, bounds) {
        var runPath = [];

        for (var i = 0; i < waypoints.length; i++) {
            var point = new google.maps.LatLng(
                waypoints[i].lat,
                waypoints[i].lon
            );

            runPath.push( point );
            // Used to compute the viewing window for the map
            // Need to include all points in the run
            bounds.extend( point );
        }

        return runPath;
    }

    /**
     * Generate the sting representation of a run for use in the static
     * Google Maps image.
     * @param  Array runPath A list of Google Maps compatible points
     */
    updateRunPathString(runPath) {
        this.runPathString = "path=color:0x0000ff|weight:5|";

        for (var i = 0; i < runPath.length; i++) {
            this.runPathString += runPath[i].A + "," + runPath[i].F;

            if (i < runPath.length - 1) {
                 this.runPathString += "|";
            }
        }
    }

    /**
     * Generate the string describing the markers to be placed on a
     * static Google Maps image.
     * @param  Coordinate start
     * @param  Coordinate end
     */
    updateMarkerString(start, end) {
        this.markerString = "markers=color:blue|" + start.A + "," +
            start.F + "|" + end.A + "," + end.F;
    }

    /**
     * Generate the string describing the zoom level for the static Google
     * Maps image.
     * @param  Map map Current map instance
     */
    mapZoomHandler(map, e) {
        this.zoomString = "zoom=" + map.zoom;
    }

    /**
     * Generate the string describing the centre of the map for the static
     * Google Maps image.
     * @param  Map map Current image instance
     */
    mapCenterHandler(map, e) {
        this.centerString = "center=" + map.center.A + "," + map.center.F;
    }

    /**
     * Generate the base for the static map string, when generating a new
     * image.
     */
    initStaticMapStrings() {
        this.defaultOptsString = "size=1168x480&maptype=roadmap";
    }

    /**
     * Create a polyline annotation on a given Map instance given a runPath
     * and a list of waypoints.
     * @param  Map map
     * @param  Array waypoints
     * @param  Array runPath
     */
    createRunPathPolyline(map, waypoints, runPath) {
        var runPathPolyLine;

        for (var i = 0; i < waypoints.length - 1; i++) {

            // Move along the path and compute the distance between each point
            var dx = parseFloat(waypoints[i].lat) -
                parseFloat(waypoints[i + 1].lat);

            var dy = parseFloat(waypoints[i].lon) -
                parseFloat(waypoints[i + 1].lon);

            var dist = Math.sqrt(dx * dx  + dy * dy) * 1000;

            // Since datapoints are evenly spaced, we can use distance to
            // imply the speed between each point pair

            // Multiply the distance to give a constant we can use in colour
            // generation
            dist *= 600;

            if ( dist > 230 ) {
                dist = 230;
            }
            if ( dist < 20 ) {
                dist = 20;
            }

            // Generate the colour for this line segment
            var r, g, b;
            r = parseInt((255 - dist));
            g = parseInt((dist));
            b = 20;

            // Create a new line segment between the given points,
            // with our computed colour
            runPathPolyLine = new google.maps.Polyline({
                path: [runPath[i], runPath[i + 1]],
                geodesic: true,
                strokeColor: 'rgba(' + r + ', ' + g + ', ' + b + ', 1)',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });

            // Apply to map
            runPathPolyLine.setMap(map);
        }
    }

    /**
     * Place the start and end flags on a given Map instance.
     * @param  Map map
     * @param  Array waypoints
     * @param  Array runPath
     */
    placeMarkers(map, waypoints, runPath) {

        // Image paths for use later
        var startImage = '/img/start.png';
        var endImage = '/img/end.png';
        var nodeImage = '/img/blank.png';
        var icon;

        for (var i = 0; i < runPath.length; i++) {

            // Only use images at the start and end of the run
            if (i == 0) {
                icon = startImage;
            } else if (i == runPath.length - 1) {
                icon = endImage;
            } else {
                // Node images are blank
                icon = nodeImage;
            }

            // Store the waypoint instance for use in a callback
            let wp = this.props.waypoints[i];

            // Create our base marker before wiring up events
            var marker = new google.maps.Marker({
                position: runPath[i],
                map: map,
                title: 'Title Test',
                icon: icon
            });

            // Scope the callbacks correctly
            (function (marker) {
                // Display the time of a datapoint on hover
                var infowindow = new google.maps.InfoWindow({
                    content: "" + window.app.moment(wp.time * 1000)
                        .format(window.app.timeFormat)
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
        // Initial bounds
        var bounds = new google.maps.LatLngBounds();
        // Process run
        var runPath = this.computeRunPath(this.props.waypoints, bounds);

        // Map display options
        var mapOptions = {
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        // Render the map
        var map = new google.maps.Map($(React.findDOMNode(this))
                .find(".map-canvas")[0], mapOptions);

        // Store map reference
        this.map = map;
        map.fitBounds(bounds);

        // Add listeners for zoom and center
        google.maps.event.addListenerOnce(map, "zoom_changed",
            this.mapZoomHandler.bind(this, map));
        google.maps.event.addListenerOnce(map, "center_changed",
            this.mapCenterHandler.bind(this, map));

        // Set markers to start and end points
        this.updateMarkerString(runPath[0], runPath[runPath.length - 1]);
        this.updateRunPathString(runPath);

        // Render polyline and markers on map
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
