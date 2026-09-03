import board
from adafruit_seesaw import seesaw, rotaryio, digitalio

i2c = board.I2C()
ENCODER_ADDRESSES = [0x36, 0x37, 0x38, 0x39]
encoders = [None] * len(ENCODER_ADDRESSES)

def connect_encoder(index):
    try:
        addr = ENCODER_ADDRESSES[index]
        encoders[index] = rotaryio.IncrementalEncoder(seesaw.Seesaw(i2c, addr=addr))
    except (OSError, ValueError):
        encoders[index] = None

for i in range(len(ENCODER_ADDRESSES)):
    connect_encoder(i)

def read_encoders():
    values = []

    for i, encoder in enumerate(encoders):
        if encoder is None:
            connect_encoder(i)
            encoder = encoders[i]
        if encoder is None:
            values.append(None)
            continue

        try:
            values.append(encoder.position)
        except OSError:
            encoders[i] = None
            values.append(None)

    return values

# import board
# from adafruit_seesaw import seesaw, rotaryio, digitalio

# i2c = board.I2C()
# encoders = [
#     rotaryio.IncrementalEncoder(seesaw.Seesaw(i2c, addr=0x36)),
#     rotaryio.IncrementalEncoder(seesaw.Seesaw(i2c, addr=0x37)),
#     rotaryio.IncrementalEncoder(seesaw.Seesaw(i2c, addr=0x38)),
#     rotaryio.IncrementalEncoder(seesaw.Seesaw(i2c, addr=0x39))
# ]

# def read_encoders():
#     return [ e.position for e in encoders ]

# ss = seesaw.Seesaw(i2c, addr=0x36)
# ss.pin_mode(24, ss.INPUT_PULLUP)

# button = digitalio.DigitalIO(ss, 24)
# encoder = rotaryio.IncrementalEncoder(ss)

# while True:
#     print(button.value, encoder.position)
#     time.sleep(0.01)
