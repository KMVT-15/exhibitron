import time

HOLD_DURATION = 5
CALIBRATION_SET = ["F1", "F2", "P2", "P3", "P4", "F3", "P5", "P6", "P7", "P9", "P10", "P11", "P12", "P16", "P17", "P18", "P19", "P20", "F4", "F5", "F6", "P22", "P23", "P24", "P25", "F12", "F13", "P26", "P32"]

low_set_timer = None
high_set_timer = None

calibration = {}

def apply(ctrl, value):
    global calibration

    if ctrl in calibration:
        low = calibration[ctrl]["low"]
        high = calibration[ctrl]["high"]

        if not low or not high:
            return value

        return low + (x * (high - low) / 100)
    else:
        return value

def detect_low_set(s):
    b1 = s["B1"] if "B1" in s else False
    b2 = s["B2"] if "B2" in s else False
    b3 = s["B3"] if "B3" in s else False
    b4 = s["B4"] if "B4" in s else False
    return b1 and b2 and b3 and b4

def detect_high_set(s):
    b34 = s["B34"] if "B1" in s else False
    b35 = s["B35"] if "B1" in s else False
    b36 = s["B36"] if "B1" in s else False
    b37 = s["B37"] if "B1" in s else False
    return b34 and b35 and b36 and b37

def handle(state):
    global calibration

    if detect_low_set(state):
        if low_set_timer:
            if time.time() - low_set_timer > HOLD_DURATION:
                calibrate("low", state)
        else:
            low_set_timer = time.time()
    else:
        low_set_timer = None
    
    if detect_high_set(state):
        if high_set_timer:
            if time.time() - high_set_timer > HOLD_DURATION:
                calibrate("high", state)
        else:
            high_set_timer = time.time()
    
    return calibration

def calibrate(mode, state):
    global calibration

    for ctrl in CALIBRATION_SET:
        if ctrl in state:
            if ctrl not in calibration:
                calibration[ctrl] = {
                    "low": None,
                    "high": None
                }

            calibration[ctrl][mode] = state[ctrl]