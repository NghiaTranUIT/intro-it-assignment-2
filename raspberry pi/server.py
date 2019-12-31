import serial
import time
import requests
import json
from gpiozero import LED

API_endpoint = "http://3.1.194.44:3000/api/sensor"

led = LED(17)
ser = serial.Serial('/dev/ttyACM0', 9600)
time.sleep(2)

while True:
    led.on()
    data = ser.readline().decode()
    print(data)
    if "{" in data and "}" in data and "}{" not in data:
        print("ok")
        header = {'content-type': 'application/json'}
        response = requests.post(API_endpoint, data=data, headers=header)
        print(response.text)
        print("Data updated!")
    time.sleep(2.5)
    led.off()
    time.sleep(2.5)