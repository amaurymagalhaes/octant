from datetime import datetime as DateTime


class Timestamp:
    def __init__(self, timestamp_us):
        if timestamp_us is None:
            raise ValueError
        self._timestamp_us = timestamp_us

    def get(self) -> int:
        return self.timestamp_us()

    def timestamp_us(self) -> int:
        return self._timestamp_us

    def timestamp_s(self) -> float:
        return self.timestamp_us() / 10**6

    def datetime(self) -> DateTime:
        return DateTime.fromtimestamp(self.timestamp_s())

    def __eq__(self, o):
        if isinstance(o, Timestamp):
            return self._timestamp_us == o._timestamp_us
        elif isinstance(o, int):
            return self._timestamp_us == o
        else:
            return False


def from_timestamp_s(timestamp_s: float) -> Timestamp:
    return Timestamp(int(timestamp_s * 10**6))


def from_timestamp_us(timestamp_us) -> Timestamp:
    return Timestamp(timestamp_us)


def from_datetime(dt: DateTime) -> Timestamp:
    return from_timestamp_s(dt.timestamp())


def now() -> Timestamp:
    now = DateTime.utcnow().timestamp()
    return from_timestamp_s(now)
