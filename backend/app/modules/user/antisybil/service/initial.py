from datetime import datetime
from typing import List

from app.extensions import db
from app.exceptions import ExternalApiException
from app.context.manager import Context
from app.infrastructure import database
from app.pydantic import Model
from app.infrastructure.external_api.common import retry_request
from app.infrastructure.external_api.gc_passport.score import (
    issue_address_for_scoring,
    fetch_score,
    fetch_stamps,
)


class InitialUserAntisybil(Model):
    def get_antisybil_status(self, _: Context, user_address: str) -> (int, datetime):
        score = database.user_antisybil.get_score_by_address(user_address)
        return score.score, score.expires_at

    def fetch_antisybil_status(
        self, _: Context, user_address: str
    ) -> (str, datetime, any):
        score = issue_address_for_scoring(user_address)

        def _retry_fetch():
            score = fetch_score(user_address)
            if score["status"] != "DONE":
                raise ExternalApiException("GP: scoring is not completed yet", 503)

        if score["status"] != "DONE":
            score = retry_request(self._retry_fetch, 200)

        all_stamps = fetch_stamps(user_address)["items"]
        cutoff = datetime.now()
        valid_stamps = _filter_older(cutoff, all_stamps)
        expires_at = datetime.now()
        if len(valid_stamps) != 0:
            expires_at = _parse_expirationDate(
                min([stamp["credential"]["expirationDate"] for stamp in valid_stamps])
            )
        return score["score"], expires_at, all_stamps

    def update_antisybil_status(
        self,
        context: Context,
        user_address: str,
        score: str,
        expires_at: datetime,
        stamps,
    ):
        database.user_antisybil.add_score(user_address, score, expires_at, stamps)
        db.session.commit()


def _parse_expirationDate(timestamp_str):
    # GP API returns expirationDate in both formats
    formats = ["%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ"]
    last_error = None
    for format_str in formats:
        try:
            return datetime.strptime(timestamp_str, format_str)
        except ValueError as exp:
            last_error = exp
    raise last_error


def _filter_older(cutoff, stamps: List[{}]) -> List[{}]:
    not_expired = (
        lambda stamp: _parse_expirationDate(stamp["credential"]["expirationDate"])
        < cutoff
    )
    return list(filter(not_expired, stamps))
