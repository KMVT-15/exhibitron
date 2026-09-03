# This was all claude so beware

import time
import threading
import mappings
from smbus2 import SMBus, i2c_msg

multiplexer_address = 0x70
encoder_register_base = 0x11
encoder_register_position = 0x30
encoder_read_delay_seconds = 0.0003
idle_sleep_seconds = 0.001

encoder_zones = [
    {"bus": 1, "channel": i, "count": len(chain)}
    for i, chain in enumerate(mappings.ENCODERS)
]

total_encoder_count = sum(zone["count"] for zone in encoder_zones)
positions = [None] * total_encoder_count
positions_lock = threading.Lock()

zone_offsets = []
running_total = 0
for zone in encoder_zones:
    zone_offsets.append(running_total)
    running_total += zone["count"]

buses_to_zones = {}
for offset, zone in zip(zone_offsets, encoder_zones):
    buses_to_zones.setdefault(zone["bus"], []).append((offset, zone["channel"], zone["count"]))


def select_channel(bus, channel):
    bus.write_byte(multiplexer_address, 1 << channel)


def read_position(bus, address):
    write = i2c_msg.write(address, [encoder_register_base, encoder_register_position])
    bus.i2c_rdwr(write)
    time.sleep(encoder_read_delay_seconds)
    read = i2c_msg.read(address, 4)
    bus.i2c_rdwr(read)
    return int.from_bytes(bytes(list(read)), "big", signed=True)


def poll_bus(bus_number, zones):
    bus = SMBus(bus_number)
    active_channel = None

    while True:
        for offset, channel, count in zones:
            if active_channel != channel:
                select_channel(bus, channel)
                active_channel = channel

            for i in range(count):
                address = 0x36 + i
                try:
                    value = read_position(bus, address)
                except OSError:
                    value = None

                with positions_lock:
                    positions[offset + i] = value

        time.sleep(idle_sleep_seconds)


def start_polling():
    for bus_number, zones in buses_to_zones.items():
        thread = threading.Thread(target=poll_bus, args=(bus_number, zones), daemon=True)
        thread.start()


def read_encoders():
    with positions_lock:
        return list(positions)


start_polling()