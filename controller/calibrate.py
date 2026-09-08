import time
import mappings

RESET_HOLD_DURATION = 5
RESET_HOLD_TIMER = 0
ANALOG_DEADZONE = 8
ENCODER_MAX_JUMP = 100

calibration = {}
encoders = [label for zone in mappings.ENCODERS for label in zone]
analog = [value for entry in mappings.ANALOG for value in entry["mapping"]]

def map_range(v, b0, b1, b2, b3):
    return b2 + ((v - b0) * (b3 - b2)) / (b1 - b0);


def apply(state):
    new_state = {}

    for ctrl in state:
        if ctrl in mappings.TRANSFORMS:
            b0, b1 = mappings.TRANSFORMS[ctrl]["old"]
            b2, b3 = mappings.TRANSFORMS[ctrl]["new"]

            state[ctrl] = map_range(state[ctrl], b0, b1, b2, b3)

        if ctrl in calibration:
            new_val = state[ctrl] - calibration[ctrl]["offset"]
        else:
            new_val = state[ctrl]

        if ctrl in analog:
            entry = calibration.setdefault(ctrl, {"offset": 0})
            prev_val = entry.get("last_output")
            if prev_val is not None and abs(new_val - prev_val) < ANALOG_DEADZONE:
                new_val = prev_val
            entry["last_output"] = new_val

        elif ctrl in encoders:
            entry = calibration.setdefault(ctrl, {"offset": 0})
            prev_val = entry.get("last_output")
            if prev_val is not None and abs(new_val - prev_val) > ENCODER_MAX_JUMP:
                new_val = prev_val
            entry["last_output"] = new_val

        new_state[ctrl] = new_val

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
