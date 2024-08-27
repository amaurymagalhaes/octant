"""Add cached status for Holonym SBT

Revision ID: 003a0cad5494
Revises: 8b425b454a86
Create Date: 2024-08-20 17:52:22.331919

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "003a0cad5494"
down_revision = "8b425b454a86"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "holonym_sbts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("has_sbt", sa.Boolean(), nullable=False),
        sa.Column("sbt_details", sa.String(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=True),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("holonym_sbts")
