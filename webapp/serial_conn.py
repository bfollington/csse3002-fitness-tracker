import serial
from serial.tools import list_ports

'''
A class which wraps the serial package to provide an interface to connect with the GPS tracking hardware. 
'''
class SerialConnector():	
	def __init__(self):
		self.baudrate = 115200
		self.current_ports = []
		self.port_names = []
		self.connected = False
		self.s = None
		self.refresh_list();

	'''
	Returns the display names of the currently connected serial ports.
	'''
	def get_port_names(self):
		return self.port_names
	
	'''
	Refreshes the current port listing. Call get_port_names() again to get the new port names.
	'''
	def refresh_list(self):
		self.current_ports = list(list_ports.comports())
		self.port_names = []
		for port in self.current_ports:
			self.port_names.append(port[1])

	'''
	Attempts to connect to the specified serial port index. The index must correspond to a value in current_ports.
	'''
	def connect(self, index):
		if (index < 0 or index >= len(self.current_ports)):
			return False
		self.s = serial.Serial(self.current_ports[index][0], self.baudrate, writeTimeout=1, timeout=1)
		if not self.s.isOpen():
			return False
		
		#Connect
		self.s.write("CONNECT\n")
		reply = self.s.readline()
		if not reply == "OK\n":
			print reply
			return False
			
		self.connected = True
		print "Connected successfully."
		return True
	'''
	Reads all the available run data from the serial connection.
	Returns the exact string reply the device sends to us, with no formatting or processing.
	'''
	def read_all_runs_raw(self):
		if not self.connected:
			return None
			
		#Query for run data
		self.s.write("RUNDATA\n")
		runData = self.s.readline().strip()
		
		#Just return what we got from the Flora directly
		return runData
	
	'''
	Reads the data from the most recent run from the serial connection. 		
	TODO: Not used right now as it isn't implemented on the Flora. Use read_all_data instead.		
	'''
	def read_last_run(self):
		if not self.connected:
			return None
				
		#Count runs
		self.s.write("COUNTRUNS\n")
		runCount = int(self.s.readline().strip())
		
		#Get last run
		self.s.write("RUNDATA " + str(runCount - 1) + "\n")
		runDataStr = self.s.readline().strip()
		runData = runDataStr.split(",")[:-1]
		
		return runData
	
	'''
	Sends a command to the device.
	'''
	def send_command(self, command_str):
		#Commands will be expanded to include passwords, etc in a future sprint. Only basic GPS data access is available in this sprint, through read_last_run()
		pass
	
	'''
	Closes the serial connection.
	'''
	def close(self):
		if not self.connected:
			return
		self.s.close()