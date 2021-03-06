from SimpleHTTPServer import SimpleHTTPRequestHandler
from BaseHTTPServer import HTTPServer

import cgi
from bson.json_util import dumps
import time
from serial_conn import SerialConnector
from serial_conn import FileSerialConnector
import time
import calendar
from dateutil.parser import parse
import run_stats

import db

debugMode = False
debugFile = "samples/demo_ben_and_max_house.txt"

class FTServer(SimpleHTTPRequestHandler):

    """
    An extension of SimpleHTTPRequestHandler that can handle custom POST
    requests.
    """

    def __init__(self, request, client_address, server):
        self.db = db.RunDatabase()
        if debugMode:
            self.serial = FileSerialConnector(debugFile)
        else:
            self.serial = SerialConnector()

        SimpleHTTPRequestHandler.__init__(self, request, client_address, server)

    def _set_headers(self, content_type='text/html'):
        """
        Sets the default headers for any successful transaction. Note that
        even if an API call fails the response will have a status of 200,
        but the error will be passed to the frontend for display.
        """
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.end_headers()

    def translate_path(self, path):
        """
        Translates a relative resource path to a fixed one. All static files
        are within the dist folder, so /dist is prepended to every path.
        This method is called by SimpleHTTPRequestHandler on every request.
        """

        if path.startswith("/js") or path.startswith("/css") or path.startswith("/img"):
            # Serve everything from /dist
            path = "/dist{0}".format(path)
        elif path.startswith("/api"):
            pass
        elif not "." in path:
            # Any route without a file extension should serve the index
            path = "/dist/index.html"

        return SimpleHTTPRequestHandler.translate_path(self, path)


    """
    All GET requests for static resources are handled by
    SimpleHTTPRequestHandler.
    """
    def do_GET(self):
        """
        Handle all GET requests. All non-api requests are passed through to the
        default SimpleHTTPRequestHandler implementation.
        """

        if self.path.startswith("/api"):
            self._set_headers("application/json")

            # get the last run imported
            if self.path.startswith("/api/latest_run"):
                return self.api_latest_run_request()

            # retrieve a list of all runs
            if self.path.startswith("/api/all_runs"):
                return self.api_all_runs_request()

            # retrieve runs that have happened since a particular date
            if self.path.startswith("/api/runs_since_date"):
                return self.api_get_runs_since_date_request()

            # get a specific run
            if self.path.startswith("/api/run"):
                return self.api_run_request()

            # delete a run
            if self.path.startswith("/api/delete_run"):
                return self.api_delete_run_request()

            # read the current settings
            if self.path.startswith("/api/settings"):
                return self.api_settings_request()

            print "Path: {}".format(self.path)

        return SimpleHTTPRequestHandler.do_GET(self)

    def api_run_request(self):
        """
        API Method: retrieve a specific run by its database ID.
        """

        run_id = self.path.replace("/api/run/", "")
        run = self.db.get_run_with_waypoints(run_id)

        if run:
            self.wfile.write( dumps( run.to_dict() ) )
        else:
            self.wfile.write( dumps( {"success": False, "message": "Id did not match a run."} ) )
        self.wfile.close()

    def api_delete_run_request(self):
        """
        API Method: delete a specific run using its database ID
        """

        run_id = self.path.replace("/api/delete_run/", "")
        success = True

        try:
            self.db.delete_run(run_id)
        except:
            success = False


        if success:
            self.wfile.write( dumps( {"success": True, "message": "Run deleted."} ) )
        else:
            self.wfile.write( dumps( {"success": False, "message": "Id did not match a run."} ) )
        self.wfile.close()

    def api_get_runs_since_date_request(self):
        """
        API Method: Retrieve runs since a given date, date parameter is expected
        to be in the form YYYY-MM-DD
        """

        date = self.path.replace("/api/runs_since_date/", "")
        success = True

        try:
            runs = self.db.get_runs_since_date(calendar.timegm(time.strptime(date, '%Y-%m-%d')))
            print "Runs: {}".format(runs)

            final_runs = []
            for run in runs:
                dict = run.to_dict()
                dict["_id"] = run._id
                final_runs.append(dict)
            self.wfile.write( dumps( {"success": True, "runs": final_runs} ) )
        except:
            self.wfile.write( dumps( {"success": False, "message": "No runs in date range."} ) )

        self.wfile.close()

    def api_latest_run_request(self):
        """
        API Method: Retrieve the last imported run
        """

        run = self.db.get_latest_run()

        if run:
            self.wfile.write( dumps( run.to_dict() ) )
        else:
            self.wfile.write( dumps( {"success": False, "message": "No runs have been stored."} ) )

        self.wfile.close()

    def api_all_runs_request(self):
        """
        API Method: Retrieve all runs ever imported. Typically used to cache
        data on the front end.
        """

        runs = self.db.get_run_list()

        if runs:
            self.wfile.write( dumps( runs ) )
        else:
            self.wfile.write( dumps( {"success": False, "message": "Could not retrieve runs."} ) )

        self.wfile.close()

    def api_settings_request(self):
        """
        API Method: Retrieve current application settings
        """

        settings = self.db.get_settings()

        if settings:
            self.wfile.write( dumps( settings ) )
        else:
            self.wfile.write( dumps( {"success": False, "message": "Could not retrieve runs."} ) )

        self.wfile.close()


    def log_message(self, format, *args):
        """
        Override the default method for logging messages, called on every
        accepted request. Trimmed down to only display the date/time of
        the request, the request type and the response code.
        """
        print "[{date_time}] {path}".format(
            date_time=self.log_date_time_string(),
            path=(format % args))


    def do_POST(self):
        """
        Custom handler for POST requests. Parses the request and then serves
        it based on the path requested.
        """

        # Cache content type for future use
        if self.headers.get('Content-Type'):
            content_type = self.headers['Content-Type']
        else:
            content_type = None

        # Parse the post headers into a form object
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST',
                     'CONTENT_TYPE': content_type,
                     })

        # Set the headers for the response
        self._set_headers("text/json")

        if (self.path == "/api/load_example"):
            """
            Example for parsing a POST request to load data from a file.
            """
            if form.has_key( "load_data" ):
                # We are only interested in the base64_image field
                if (field == "load_data"):

                    load_data = form["load_data"].value

                    resp = dumps({"success": True})
                    self.wfile.write(resp)
                    return

            resp = dumps({"success": False, "error": "Invalid load request."})
            return

        if (self.path == "/api/save_example"):
            """
            Example for parsing a POST request to save data to a file.
            """

            if form.has_key( "save_data" ):
                save_data = form["save_data"].value

                resp = dumps({"success": True})
                self.wfile.write(resp)
                return

            # If no base64_image field was present, the upload is invalid
            resp = dumps({"success": False, "error": "Invalid save request."})
            self.wfile.write(resp)
            return

        if (self.path == "/api/import_data"):
            """
            API Method: Import data from a connected run tracker.
            If no device is connected, then return an error.
            """

            password = False
            if form.has_key( "password" ):
                password = form["password"].value

            # authenticate with the device using the passed password
            run_data = self.serial.get_runs(password)
            if run_data != None:
                resp = dumps({"success": True})

                # read current settings
                user_settings = self.db.get_settings()
                height = user_settings['height']
                weight = user_settings['weight']
                age = user_settings['age']
                gender = user_settings['gender']

                for run in run_data:

                    waypoints = []
                    for point in run:
                        waypoints.append(db.Waypoint(point[0], point[1], point[2]))

                    dbrun = db.Run(waypoints)

                    # calculate stats using settings
                    stats = run_stats.calc_statistics(waypoints, height, weight, age, gender)
                    dbrun.set_statistics(stats)
                    self.db.push_run(dbrun)
            else:
                resp = dumps({"success": False, "error": "Could not connect to device, ensure your device is plugged in and that your password is correct."})

            self.wfile.write(resp)
            return

        if (self.path == "/api/update_settings"):
            """
            API Method: Update settings based on user input. Changes the
            stored gender, height, weight and age.
            """

            new_settings = {}
            for setting in ["gender", "height", "weight", "age"]:
                if form.has_key(setting):
                    new_settings[setting] = form[setting].value

            if self.db.set_settings(new_settings) is True:
                resp = dumps({"success": True})
            else:
                resp = dumps({"success": False, "error": "Could not update the configuration settings."})

            self.wfile.write(resp)
            return


        # No route could be matched, so return an error
        resp = dumps({"success": False, "error": "Invalid path."})
        self.wfile.write(resp)
        return


def run(server_class=HTTPServer, handler_class=FTServer, port=8080):
    """
    Create an instance of the server and detach it, using the specified
    handler and port.
    """

    print ""
    print "Launching FTServer on port {0}...".format(port)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print "Server bound!"
    print ""
    httpd.serve_forever()

"""
When run from the command line, the server will be run immediately.
"""
if __name__ == "__main__":
    run()
