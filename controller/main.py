import smbus2
import mappings
import seesaw
import calibrate
import i2c
import time

bus = smbus2.SMBus(1)

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
            state[ctrl] = calibrate.apply(ctrl, val / 255 * 100)
    
    for idx, val in enumerate(seesaw.read_encoders()):
        if idx >= len(mappings.ENCODERS):
            continue
        
        if not val:
            continue
        
        if val > 99999999 or val < -99999999:
            continue

        state[mappings.ENCODERS[idx]] = val

    return state

def compare(a, b):
    delta = {}

    for key, value in b.items():
        if key not in a or a[key] != value:
            delta[key] = value

    return delta

for zone in mappings.DIGITAL:
    i2c.mcp_init(bus, zone["address"])

state = read_all()
last_init = time.time()

while True:
    new = read_all()
    changes = compare(state, new)
    state = new

    if changes:
        print(changes)
    
    calibrate.handle(state)
    
    if time.time() - last_init > 1:
        for zone in mappings.DIGITAL:
            i2c.mcp_init(bus, zone["address"])

        last_init = time.time()

