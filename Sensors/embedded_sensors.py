import time
import smbus2
from time import sleep
from ccs811 import ccs811Begin, CCS811_driveMode_1sec, ccs811SetEnvironmentalData, ccs811CheckDataAndUpdate, ccs811GetCO2, ccs811GetTVOC, ccs811CheckForError, ccs811PrintError
import Adafruit_ADS1x15
import RPi.GPIO as GPIO
import json
import requests


ID = 1
ADDRESS = 'http://13.41.188.158:8080/api/recdata'
DATA = {}
def init():
        DATA['id'] = 'device' + str(ID)
def sendData():

        json_data = json.dumps(DATA)
        headers = {'Content-type': 'application/json'}
        try:
                response = requests.post(ADDRESS, data=json_data, headers=headers)
        except:
                print("Couldn't reach host")

# Create an ADS1115 ADC (16-bit) instance.
adc = Adafruit_ADS1x15.ADS1115()
# Choose a gain of 1 for reading voltages from 0 to 4.09V.
# Or pick a different gain to change the range of voltages that are read:
#  - 2/3 = +/-6.144V
#  -   1 = +/-4.096V
#  -   2 = +/-2.048V
#  -   4 = +/-1.024V
#  -   8 = +/-0.512V
#  -  16 = +/-0.256V
# See table 3 in the ADS1015/ADS1115 datasheet for more info on gain.
GAIN = 1


GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
DIGITAL_PIN = 17
GPIO.setup(DIGITAL_PIN, GPIO.IN)

si7021_ADD = 0x40 #Add the I2C bus address for the sensor here
si7021_READ_TEMPERATURE = 0xF3 #Add the command to read temperature here
si7021_READ_HUMIDITY = 0xF5

bus = smbus2.SMBus(1)


# ccs811 stuff
ccs811Begin(CCS811_driveMode_1sec)                                      #start CCS811, data update rate at 1sec
init()
while(1):
        #Analog stuff
        analog_values = [0]*4
        for i in range(4):
                # Read the specified ADC channel using the previously set gain value.
                analog_values[i] = adc.read_adc(i, gain=GAIN)
        
        windvoltage = analog_values[0] * 4.096 / 32767
        #change this to 0.5?
        if windvoltage > 0.4:
                windspeed = (-2.62534 * pow(windvoltage, 6)) + (20.87142 * pow(windvoltage, 5)) \
                        + (-68.14970 * pow(windvoltage, 4)) + (117.16178 * pow(windvoltage, 3)) \
                        + (-111.95726 * pow(windvoltage, 2)) + (58.03388 * pow(windvoltage, 1)) \
                        + -12.00028
                print("Wind speed: ", round(windspeed, 2), "m/s")
                DATA['wind'] = windspeed
        else:
                print("Wind speed: 0m/s (too low so flow is reversed)")
                DATA['wind'] = 0.0
        
        
        if GPIO.input(DIGITAL_PIN)==0:
                print('Raining!')
                rainVal = analog_values[1] * 4.096 / 32767
                # rainVal = 100 - (analog_values[1] * 100 / 32767)
                print("Moisture: ", round(rainVal,2) , "%")
                DATA['rain'] = rainVal
                
        else:
                print('Not raining!')
                rainVal = analog_values[1] * 4.096 / 32767
                print("Moisture: ", round(rainVal,2) , "%")
                DATA['rain'] = 0.0
        
        
        #Temp readings
        cmd_meas_temp = smbus2.i2c_msg.write(si7021_ADD,[si7021_READ_TEMPERATURE])
        read_result_temp = smbus2.i2c_msg.read(si7021_ADD,2)
        bus.i2c_rdwr(cmd_meas_temp)
        time.sleep(0.1)
        bus.i2c_rdwr(read_result_temp)
        temperature = int.from_bytes(read_result_temp.buf[0]+read_result_temp.buf[1],'big')
        tempc = (175.72 * temperature / 65536) - 46.85

        #Repeat for Humidity
        cmd_meas_humidity = smbus2.i2c_msg.write(si7021_ADD,[si7021_READ_HUMIDITY])
        read_result_humidity = smbus2.i2c_msg.read(si7021_ADD,2)
        bus.i2c_rdwr(cmd_meas_humidity)
        time.sleep(0.1)
        bus.i2c_rdwr(read_result_humidity)
        humidity = int.from_bytes(read_result_humidity.buf[0]+read_result_humidity.buf[1],'big')
        humidity_perc = (125 * humidity / 65536) - 6

        print("Temperature in °C: ", round(tempc, 2))
        print("Humidity in %: ", round(humidity_perc, 2))
        DATA['temp'] = tempc
        DATA['humidity'] = humidity_perc

        # Use temp and humidity to get CO2 and tVOC from
        ccs811SetEnvironmentalData(tempc, humidity_perc)

        if ccs811CheckDataAndUpdate():
                CO2 = ccs811GetCO2()
                tVOC = ccs811GetTVOC()
                print ("CO2 : %d ppm" %CO2)
                print ("tVOC : %d ppb" %tVOC)
                DATA['Co2'] = CO2
                DATA['tVoc'] = tVOC
        elif ccs811CheckForError():
                ccs811PrintError()
        sendData()
        sleep(2)


# Note you can change the I2C address from its default (0x48), and/or the I2C
# bus by passing in these optional parameters:
#adc = Adafruit_ADS1x15.ADS1015(address=0x49, busnum=1)



# print('Reading ADS1x15 values, press Ctrl-C to quit...')
# # Print nice channel column headers.
# print('| {0:>6} | {1:>6} | {2:>6} | {3:>6} |'.format(*range(4)))
# print('-' * 37)
# # Main loop.
# while True:
#     # Read all the ADC channel values in a list.
#     values = [0]*4
#     for i in range(4):
#         # Read the specified ADC channel using the previously set gain value.
#         values[i] = adc.read_adc(i, gain=GAIN)
#         # Note you can also pass in an optional data_rate parameter that controls
#         # the ADC conversion time (in samples/second). Each chip has a different
#         # set of allowed data rate values, see datasheet Table 9 config register
#         # DR bit values.
#         #values[i] = adc.read_adc(i, gain=GAIN, data_rate=128)
#         # Each value will be a 12 or 16 bit signed integer value depending on the
#         # ADC (ADS1015 = 12-bit, ADS1115 = 16-bit).
#     # Print the ADC values.
#     print('| {0:>6} | {1:>6} | {2:>6} | {3:>6} |'.format(*values))
#     # Pause for half a second.
#     time.sleep(0.5)

    
    
# while(1):
#     #Temp readings
#     cmd_meas_temp = smbus2.i2c_msg.write(si7021_ADD,[si7021_READ_TEMPERATURE])
#     read_result_temp = smbus2.i2c_msg.read(si7021_ADD,2)
#     bus.i2c_rdwr(cmd_meas_temp)
#     time.sleep(0.1)
#     bus.i2c_rdwr(read_result_temp)
#     temperature = int.from_bytes(read_result_temp.buf[0]+read_result_temp.buf[1],'big')
#     tempc = (175.72 * temperature / 65536) - 46.85

#     #Repeat for Humidity
#     cmd_meas_humidity = smbus2.i2c_msg.write(si7021_ADD,[si7021_READ_HUMIDITY])
#     read_result_humidity = smbus2.i2c_msg.read(si7021_ADD,2)
#     bus.i2c_rdwr(cmd_meas_humidity)
#     time.sleep(0.1)
#     bus.i2c_rdwr(read_result_humidity)
#     humidity = int.from_bytes(read_result_humidity.buf[0]+read_result_humidity.buf[1],'big')
#     humidity_perc = (125 * humidity / 65536) - 6

#     print("Temperature in °C: ", round(tempc, 2))
#     print("Humidity in %: ", round(humidity_perc, 2))