from app.extensions import epochs


def get_current_epoch() -> int:
    return epochs.get_current_epoch()
