import smbus2
import mappings
import calibrate
import encoders
import i2c
import time
import json
import websocket

WS_URL = "ws://10.10.3.50:8080"

ws = websocket.create_connection(WS_URL)

def send_params(params: dict):
    message = json.dumps({"params": params})
    ws.send(message)
    print(f">> {message}")

bus = smbus2.SMBus(1)
encoder_labels = [label for zone in mappings.ENCODERS for label in zone]

def init_all():
    for zone in mappings.DIGITAL:
        i2c.mcp_init(bus, zone["address"])

def read_all():
    state = {}

    for zone in mappings.DIGITAL:
        data = i2c.mcp_read(bus, zone["address"])

        if not data:
            continue

        for idx, ctrl in enumerate(zone["mapping"]):
            state[ctrl] = 1 - data[idx]

    for zone in mappings.ANALOG:
        for i in range(8):
            if i >= len(zone["mapping"]):
                continue

            val = i2c.adc_read(bus, zone["address"], i)

            if not val:
                continue

            ctrl = zone["mapping"][i]

            state[ctrl] = val
            # state[ctrl] = calibrate.apply(ctrl, val / 255 * 100)
    
    for idx, val in enumerate(encoders.read_encoders()):
        if idx >= len(encoder_labels):
            continue

        label = encoder_labels[idx]
 
        if not val:
            continue
 
        if val > 99999999 or val < -99999999:
            continue

        state[label] = val

    return state

def compare(a, b):
    delta = {}

    for key, value in b.items():
        if key not in a or a[key] != value:
            delta[key] = value

    return delta

for zone in mappings.DIGITAL:
    i2c.mcp_init(bus, zone["address"])

raw_state = read_all()
state = raw_state
last_init = time.time()
calibrate.calibrate(raw_state)

while True:
    raw_state = read_all()
    calibrate.handle(raw_state)

    new = calibrate.apply(raw_state)
    changes = compare(state, new)
    state = new

    if changes:
        print(changes)
        # send_params(changes)
    
    if time.time() - last_init > 1:
        for zone in mappings.DIGITAL:
            i2c.mcp_init(bus, zone["address"])

        last_init = time.time()
