from typing import List, Optional

from eth_utils import to_checksum_address

from app.database.models import User
from app.exceptions import UserNotFound
from app.extensions import db


def get_all() -> List[User]:
    return User.query.all()


def get_by_address(user_address: str) -> Optional[User]:
    return User.query.filter_by(address=to_checksum_address(user_address)).first()


def add_user(user_address: str) -> User:
    user = User(address=to_checksum_address(user_address))
    db.session.add(user)

    return user


def get_or_add_user(user_address: str) -> User:
    user = get_by_address(user_address)
    if not user:
        user = add_user(user_address)

    return user


def toggle_patron_mode(user_address: str) -> bool:
    user = get_by_address(user_address)
    if not user:
        raise UserNotFound(user_address)
    user.patron_mode = not user.patron_mode
    db.session.add(user)

    return user.patron_mode
