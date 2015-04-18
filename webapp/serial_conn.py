import serial
from serial.tools import list_ports

class SerialConnector():	
	def __init__(self):
		self.baudrate = 115200
		self.current_ports = []
		self.port_names = []
		self.connected = False
		self.s = None
		self.refresh_list();

	def get_port_names(self):
		return self.port_names
		
	def refresh_list(self):
		self.current_ports = list(list_ports.comports())
		self.port_names = []
		for port in self.current_ports:
			self.port_names.append(port[1])

	def connect(self, index):
		if (index < 0 or index >= len(self.current_ports)):
			return False
		self.s = serial.Serial(self.current_ports[index][0], self.baudrate, writeTimeout=1, timeout=1)
		if not self.s.isOpen():
			return False
			
		#TODO: confirm Jamie's "expected" connect message		
		#Connect
		self.s.write("CONNECT\n")
		if not self.s.readline() == "OK":
			return False
			
		self.connected = True
		return True
	
	def read_last_run(self):
		if not self.connected:
			return None
				
		#Count runs
		self.s.write("COUNTRUNS\n")
		runCount = int(self.s.readline())
		
		#Get last run
		self.s.write("RUNDATA " + str(runCount - 1) + "\n")
		runDataStr = self.s.readline()
		runData = runDataStr.split(",")[:-1]
		
		return runData
		
	def send_command(self, command_str):
		#Commands will be expanded to include passwords, etc in a future sprint. Only basic GPS data access is available in this sprint, through read_last_run()
		pass
		
	def close(self):
		if not self.connected:
			return
		self.s.close()