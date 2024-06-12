from decimal import Decimal

from tests.modules.octant_rewards.helpers import overhaul_formulas

MNEMONIC = "test test test test test test test test test test test junk"
STARTING_EPOCH = 1
MOCKED_PENDING_EPOCH_NO = 1
MOCKED_FINALIZED_EPOCH_NO = 1
MOCKED_EPOCH_NO_AFTER_OVERHAUL = 3
MOCKED_CURRENT_EPOCH_NO = 2
NO_PATRONS_REWARDS = 0
ETH_PROCEEDS = 402_410958904_110000000
TOTAL_ED = 100022700_000000000_099999994
USER1_ED = 1500_000055377_000000000
USER2_ED = 5500_000000000_000000000
USER3_ED = 2000_000000000_000000000
USER1_BUDGET = 1526868_989237987
USER2_BUDGET = 5598519_420519815
USER3_BUDGET = 2035825_243825387
USER_MOCKED_BUDGET = 10 * 10**18 * 10**18

LOCKED_RATIO = Decimal("0.100022700000000000099999994")
TOTAL_REWARDS = 321_928767123_288031232
VANILLA_INDIVIDUAL_REWARDS = 101_814368807_786782825
MATCHED_REWARDS = TOTAL_REWARDS - VANILLA_INDIVIDUAL_REWARDS + NO_PATRONS_REWARDS
OPERATIONAL_COST = 80_482191780_822000000
LEFTOVER = ETH_PROCEEDS - TOTAL_REWARDS - OPERATIONAL_COST
TOTAL_WITHDRAWALS = USER1_ED + MATCHED_REWARDS
PPF = overhaul_formulas.ppf(ETH_PROCEEDS, VANILLA_INDIVIDUAL_REWARDS, LOCKED_RATIO)
MATCHED_REWARDS_AFTER_OVERHAUL = overhaul_formulas.matched_rewards(
    ETH_PROCEEDS, LOCKED_RATIO, USER2_BUDGET
)
COMMUNITY_FUND = int(Decimal("0.05") * ETH_PROCEEDS)

USER1_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
USER2_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
USER3_ADDRESS = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"

DEPLOYER_PRIV = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
ALICE = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
ALICE_ADDRESS = USER1_ADDRESS
BOB = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
BOB_ADDRESS = USER2_ADDRESS
CAROL = "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
CAROL_ADDRESS = USER3_ADDRESS

MULTISIG_APPROVALS_THRESHOLD = 2
MULTISIG_MOCKED_MESSAGE = "Hello World!"
MULTISIG_MOCKED_HASH = (
    "0x8227aee7a90b3b36779bc7d9f1f0b4c2e6c5262838dc68ffcf1f66ee4744e059"
)

MULTISIG_MOCKED_SAFE_HASH = (
    "0x58c5c0841f72c744777a2ab04a86dba3afa55286e668dffb98224ff78e151d8f"
)

MULTISIG_MOCKED_CONFIRMED_SIGNATURE = "0x1c2ca05dbfda9d996aacf47b78f5ee6f477171c3895fe0bd496f68b33f68059463539264dffb513c4bf7857aaa646c170f3a47189a61ae9734d3724503c560f220a37a1d5689b5daf1003a06479952701bc3574d66fa89c4433c634a864910ddf337b63354a66b11bedb5b6e4f7c0bf1fe2d2797d05dd288fb56e8e5d636a5064c1ca966dd0a074f4891a286b115adc191469bc19fe07105468ca582bd82c952165529a452e93ddbb062859bd2fd4c6efd68808a5e3444053ddd5e46244bb300c6fd1f"
MULTISIG_ADDRESS = "0xa40FcB633d0A6c0d27aA9367047635Ff656229B0"

MR_FUNDING_CAP_PERCENT = Decimal("0.2")
