"""empty message

Revision ID: 306a56af8932
Revises: a49d3e62bda9
Create Date: 2023-07-27 09:04:54.184654

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "306a56af8932"
down_revision = "a49d3e62bda9"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "user_consents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("ip", sa.String(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=True),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("user_consents")
    # ### end Alembic commands ###
