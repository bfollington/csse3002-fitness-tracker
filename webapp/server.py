from SimpleHTTPServer import SimpleHTTPRequestHandler
from BaseHTTPServer import HTTPServer

import cgi
import json
import time


class FTServer(SimpleHTTPRequestHandler):

    """
    An extension of SimpleHTTPRequestHandler that can handle custom POST
    requests.
    """

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
        if path.startswith("/js") or path.startswith("/css"):
            # Serve everything from /dist
            path = "/dist{0}".format(path)
        elif path.startswith("/api"):
            pass
        elif not "." in path:
            # Any route without a file extension should serve the index
            path = "/dist/index.html"

        return SimpleHTTPRequestHandler.translate_path(self, path)

    def log_message(self, format, *args):
        """
        Override the default method for logging messages, called on every
        accepted request. Trimmed down to only display the date/time of
        the request, the request type and the response code.
        """
        print "[{date_time}] {path}".format(
            date_time=self.log_date_time_string(),
            path=(format % args))


    """
    All GET requests for static resources are handled by
    SimpleHTTPRequestHandler.
    """

    def do_POST(self):
        """
        Custom handler for POST requests. Parses the request and then serves
        it based on the path requested.
        """

        # Parse the post headers into a form object
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST',
                     'CONTENT_TYPE': self.headers['Content-Type'],
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

                    resp = json.dumps({"success": True})
                    self.wfile.write(resp)
                    return

            resp = json.dumps({"success": False, "error": "Invalid load request."})
            return

        if (self.path == "/api/save_example"):
            """
            Example for parsing a POST request to save data to a file.
            """

            if form.has_key( "save_data" ):
                save_data = form["save_data"].value

                resp = json.dumps({"success": True})
                self.wfile.write(resp)
                return

            # If no base64_image field was present, the upload is invalid
            resp = json.dumps({"success": False, "error": "Invalid save request."})
            self.wfile.write(resp)
            return


        # No route could be matched, so return an error
        resp = json.dumps({"success": False, "error": "Invalid path."})
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
