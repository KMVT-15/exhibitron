import smbus2

ADC_MAPPING = [0x84, 0xC4, 0x94, 0xD4, 0xA4, 0xE4, 0xB4, 0xF4]
IODIRA = 0x00
IODIRB = 0x01
GPIOA = 0x12
GPIOB = 0x13
GPPUA = 0x0C
GPPUB = 0x0D

def null_errors(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except OSError as e:
            print(e, *args, **kwargs)
            return None

    return wrapper

@null_errors
def mux_set(bus, address, channel):
    bus.write_byte(address, channel)

@null_errors
def mcp_init(bus, address):
    bus.write_byte_data(address, IODIRA, 0xFF)
    bus.write_byte_data(address, IODIRB, 0xFF)
    bus.write_byte_data(address, GPPUA, 0xFF)
    bus.write_byte_data(address, GPPUB, 0xFF)

@null_errors
def mcp_read(bus, address):
    port_a = bus.read_byte_data(address, GPIOA)
    port_b = bus.read_byte_data(address, GPIOB)

    combined = port_a | (port_b << 8)

    return [(combined >> i) & 0x01 for i in range(16)]

@null_errors
def adc_read(bus, address, index):
    write = smbus2.i2c_msg.write(address, [ADC_MAPPING[index]])
    read = smbus2.i2c_msg.read(address, 1)
    bus.i2c_rdwr(write, read)

    return list(read)[0]