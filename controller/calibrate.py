import time
import mappings

RESET_HOLD_DURATION = 5
RESET_HOLD_TIMER = 0

calibration = {}
encoders = [label for zone in mappings.ENCODERS for label in zone]

def apply(state):
    new_state = {}

    for ctrl in state:
        if ctrl in calibration:
            new_val = state[ctrl] - calibration[ctrl]["offset"]
            new_state[ctrl] = new_val
        else:
            new_state[ctrl] = state[ctrl]

    return new_state

def detect_reset(s):
    b1 = s["B1"] if "B1" in s else False
    b2 = s["B2"] if "B2" in s else False
    b3 = s["B3"] if "B3" in s else False
    b4 = s["B4"] if "B4" in s else False
    return b1 and b2 and b3 and b4

def handle(state):
    global RESET_HOLD_TIMER

    if detect_reset(state):
        if RESET_HOLD_TIMER != 0:
            if time.time() - RESET_HOLD_TIMER > RESET_HOLD_DURATION:
                RESET_HOLD_TIMER = 0
                calibrate(state)
        else:
            RESET_HOLD_TIMER = time.time()

def calibrate(state):
    global calibration

    for encoder in encoders:
        if encoder in state:
            calibration[encoder] = {
                "offset": state[encoder],
            }
