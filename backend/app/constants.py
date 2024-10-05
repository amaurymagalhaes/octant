from decimal import Decimal

MAINNET_VALIDATORS_ETHEREUM_ADDRESS = "0x4f80Ce44aFAb1e5E940574F135802E12ad2A5eF0"

# bytes4(keccak256("isValidSignature(bytes,bytes)")
# EIP-1271 defines a standard way for smart contracts to verify signatures. When the `isValidSignature` function
# of a contract is called and confirms the signature is valid, it returns this magic value. The value is derived
# from the first four bytes of the keccak256 hash of the string "isValidSignature(bytes,bytes)".
EIP1271_MAGIC_VALUE_BYTES = "20c13b0b"

GLM_TOTAL_SUPPLY_WEI = 1_000000000_000000000_000000000
VALIDATOR_DEPOSIT_GWEI = 32_000000000
ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
MR_FUNDING_CAP_PERCENT = Decimal("0.2")
LOW_UQ_SCORE = Decimal("0.01")
MAX_UQ_SCORE = Decimal("1.0")
UQ_THRESHOLD_NOT_MAINNET = 5
UQ_THRESHOLD_MAINNET = 15

BEACONCHAIN_API = "https://beaconcha.in/api"
ETHERSCAN_API = "https://api.etherscan.io/api"
BITQUERY_API = "https://streaming.bitquery.io/graphql"
GC_PASSPORT_SCORER_API = "https://api.scorer.gitcoin.co"
SAFE_API_MAINNET = "https://safe-transaction-mainnet.safe.global/api/v1"
SAFE_API_SEPOLIA = "https://safe-transaction-sepolia.safe.global/api/v1"

DEFAULT_MAINNET_PROJECT_CIDS = "QmSQEFD35gKxdPEmngNt1CWe3kSwiiGqBn1Z3FZvWb8mvK,Qmds9N5y2vkMuPTD6M4EBxNXnf3bjTDmzWBGnCkQGsMMGe,QmSXcT18anMXKACTueom8GXw8zrxTBbHGB71atitf6gZ9V"

EPOCH0_SYBILS = [
    "0xde19a6ce83cc934e5d4c4573f0f026c02c984fb2",
    "0x673bb40e274786dc58fd19fbbf9ffa1f903a2fd8",
    "0x1b8da75295cf01bf23b66db1df19fd033ef9bd86",
    "0x047d26f4eeba32dbbad29078abe0974faa037266",
    "0xb57d7e4cf73e0e6383a87f23104e4f4c8b317376",
    "0x5a979491d8aeeff81846312b813e4a77779df1f9",
    "0x446966833acb28c9a6fc7b6eb463b70815a3b182",
    "0x1c1575a69a79b2d7e853e1d4e2e07979a33d4899",
    "0xbf3d49007f31d2b79635fb7372f435fb9a0c4900",
    "0x7480014c77b15aca1054af7cbb0888833326076c",
    "0x705565c4413c384721a70a0a6a646ed43c6ad7fc",
    "0xfbc8f2951d5255dcad5938557cfd505d8b9513cf",
    "0x9fa62342f6f6e494ec4fc42822611d0395faab8b",
    "0x195f7ed714986ef27463a82d017b47bf8b2a6a35",
    "0x049c9db54a3d21652546958977318966114b373b",
    "0x4343182e56b1ac756ef2fc81466c63c2bc275404",
    "0x2cbb536a8d80974f3cc91dbb8c6a1b2a5659108c",
    "0x140a50799d54e9059195b1f01ab3ec26106b161e",
    "0x92db0aa43acc43b8b685a0f46f5193bf87462df2",
    "0x46cda5eb47b88cafddbe2dfe53285b1da1d860eb",
    "0x9b7a33687e43a0c458900237ce154823a9b473b3",
    "0x36ad9923ca4b24794507d3b5fcab50f8ae616e6d",
    "0xe9f24ad877c0b3b63ed4ecfcca21f50df7e6c4d1",
    "0xa38005879daff0c35ca8c726764e020fd07ce16e",
    "0x0f76c80d5c1e0c5f118e56ac1195b6b6a8b50c8a",
    "0x2655fc09ce0336e2ba6143afa4a4ac840d98e424",
    "0x791a0f13cd2ad330a9f3dba4cf83dd606e0f0023",
    "0x8260eb7b04b1f4facf78ed90d4254fc97f9ba6a1",
    "0x1144a84e81349cf347c3bb75237741f2936795a5",
    "0x9453efe4177bfdc244ca70627c8948880c5416f3",
    "0xd285a581e4129605c13ca6d32be09d10a3579a1d",
    "0xb5dd7d81bcff4640d5f8aeec8162e5e1418aa5ba",
    "0xaf6adb966a6db512fac9606c9116aa42efdd534b",
    "0xb02ab3a052cc614460db46d32156cb0c41478c3e",
    "0x66b8390157e5afc8f42a84f34a1a12e02220fc37",
    "0xfad129ef592408085d3b1d8d61d6c676a9dfc49f",
    "0x7fd120639464401d5d7d13a9c22276169fa553e3",
    "0x992064c3065422dc7f3139645ff9f31ee0775a83",
    "0x55bc90139259ec9ab21d89be918d7b94e0faffb5",
    "0x9774c35e38ccaf1f1604cb8062c934510375b539",
    "0xbda7c5b8a747487b475468d556dcb744b4f7d240",
    "0xe43d836c07e8159a114fb8f06c1851468655dbd0",
    "0x3fc8be2b93c54eaf6cdb5ee47420e5b3c0434975",
    "0xb227220dd3479c634bacf59e99f39925628478ab",
    "0xe78d59cf340665bf7157cb600b44f3032f4c27f6",
    "0x930e299b84453732797c14fed9c0830bb8946dea",
    "0x0a4d7d043107108ec348a19a60219398e7b4fb4d",
    "0x7fbb70da8c4ee8ecf07a39f5e2b866d9b3de7238",
    "0xf7d9a2902db9829a2c51004253a3a3cfe4d1a4cc",
    "0xb06d62011c26cf0aede7cdc6c412bd367f1aa18d",
    "0xcd11c24ccd74428e6be992e78e03fa4a1cbd4d54",
    "0xc93d7cc62a21488396cdd0fe5e4fd1b721069303",
    "0x08f2aeda703348ebaadfa84723126f0927ffce62",
    "0x78117085818a049ba5ca8bfd9e8f75c849745f85",
    "0x5d8aeed55130626a473eb75bf1301ce3199c85b4",
    "0x934775ce4466a38226cb593895a7fda112c9b1e0",
    "0x843ea4d5b8b34e07a63d256785a1c9560f3ea2bc",
    "0xea809d3fb969d1d4de90c022c34b075b1fa5ec50",
]

GUEST_LIST = {
    "0x16f3f2f0ba34973937A1ebb989a295Ca106b67C7",
    "0xBB5935dAaFbacAE82c8D2CA8377F16073D70061a",
    "0xba84B5cA750b33DfAdDBFdD1B7C6887885a34977",
    "0x4e9A05226993F094A56A3472C8c816F2599423A6",
    "0x40DE3299Bd8a10D8Ac3f32C1A55DE40640cF9B75",
    "0xC33F87697EF41e0E95e7a55d1ec8180F04088578",
    "0xCBc924183Bc32D02746Fa8D38843B5Ce08662eB4",
    "0xDc9C5e34959eC3643AF1e1D34A83D6b251AAb1eF",
    "0x762BBc211990D0a356F35E4D500843F59d223C2e",
    "0x55187a1165EBB441A1BF227fff1EB0D32a65bc46",
    "0x7aE59f3F2B2E5f3842B50a15bCb5247c5De881Be",
    "0x59072B3a3287F4a75cadfb36D671A2f0d1959B09",
    "0x4A5da2a1D3258dF8FFb431Cf0110FE9b98ADeEbf",
    "0x514A9771Af8Afe71057666b680238dFBeA578d65",
    "0xE70055e9575f15A6f51F3068901D73ac63952adF",
    "0x9e831B58001e2b69F70C892e4F8ce9d2118B7E00",
    "0x51c1C7f1e168a36Bf1FaBFD91E98b43476a6B14D",
    "0x33878e070db7f70D2953Fe0278Cd32aDf8104572",
    "0x3df13B9bd79158f0cccDDd0833cF774178e3d2e9",
    "0xB9573982875b83aaDc1296726E2ae77D13D9B98F",
    "0xE862E2C1ca94eAcfEDe3c95a217c15EF0086a29D",
    "0x0442A9aBbc93058a873c371F21CC366338254A88",
    "0x0194325BF525Be0D4fBB0856894cEd74Da3B8356",
    "0x399e0Ae23663F27181Ebb4e66Ec504b3AAB25541",
    "0x9f729294b308f79243285348A7Be3f58ae5ED31A",
    "0xb62E762Af637b49Eb4870BCe8fE21bffF189e495",
    "0x5725a458b319d73B8Ec84c47de80620E7B191B0C",
    "0x57Ccc081824b43B75986727875929AF3A6Ad721C",
    "0xf13e477365B0FAa64130DA2FF663aAb20d32d929",
    "0xFD868dB0696ef762351F8421535cC5f9F423B23C",
    "0x30043aAbBCeBbD887437Ec4F0Cfe6d4c0eB5CC64",
    "0xAa01DeC5307CF17F20881A3286dcaA062578cea7",
    "0x3FFD0C300fa4a021364Ae7e85a7b0d3a02133f99",
    "0xBEa26DE685Ef828b60cA53b40Ecc9Bab35645fDF",
    "0x4103CFcb300599dFcB31dBc95d919592619B4EAc",
    "0x22bAac1E95efC010E35D5eD643BB16c9dB254a11",
    "0x686A484bc2E2bE79f358c7055e8539A69413A3Ed",
    "0x073a360C372FD51Bd6E56B4a4d73790fDAec4641",
    "0xdd0206010CA82fF22303b58863b3a6f3006C86C4",
    "0x25FA68A4c340202737EDBC67fD1a2Ec8DE872dB6",
    "0x5b655EDa7D101f98934392Cc3610BcB25b633789",
    "0x32cEfb2dC869BBfe636f7547CDa43f561Bf88d5A",
    "0xA4369e39e3ED13593Adb0142A1ea5d08AbdF99C4",
    "0xA8F0048A0d1A04663Ca5010d0bEaC5BCAEeA0eef",
    "0x65F632cfe8015B7ae6976e549645ed04cde60fe4",
    "0xb35E0a0D00c640ab75fAD3cf3B83264bC64D23eC",
    "0xafA3E6E29D99337b166b83fB24bA17b19764B49D",
    "0x57DD1517c12659365E59F71129Fa9B1611Dd18AF",
    "0x9120FfD5d04ca4B26AaBCe611989A8F026dc099a",
    "0x2AC6A3561a43f06d62602eF9728C2B9eEc393326",
    "0x297Aa50D0557c865F6C9B0AA0a91f41C26E55eE6",
    "0x9Ff46343d0b652D6e766F85f9aE91653869349a5",
    "0xEd36bf0b2b17768E782Db2ece6A327055b2f3e9C",
    "0xC28D2fDFE6d5a482d32f855457Bb5F8cAcdB32b1",
    "0x1d44404C1C53991Ec33095225da173d544Cd4Af3",
    "0x5d9fbd984B9CeC714a4B14c38Ea83bBC82d06d69",
    "0x5Bc0AEbdbab698e12FD33A2E133e6858fe6Cdd76",
    "0x66805D8B82664Acab4CbE0C0498889dDE9aF7841",
    "0xaF7610578F54c7De7563655AaF461E2CbeCB08C6",
    "0x6c3F373Baec5D2d0Fb3C82C4f3Db5E48873ae363",
    "0x015122A625b45f68E6D795C0Ab99fC7107e4c3B9",
    "0x508A4F07B60BA0940283Cd4e32d5DEb0CC38AdF7",
    "0xb150c9bEd10a8C62997d58a81c4e1fA75160643e",
    "0x212647c56BA10ee429a838bc567dFb03A8D054Ba",
    "0x73306dAb0D39A4D47df4972c7022CB2cac075D4e",
    "0x914D5d84aAA064207C2c31014426227405edab41",
    "0x3FBcEC42405391B1fb377664daA5AE7Bc9Ba7BF5",
    "0x8c8296a0042E842Cb865DfFD94678c941fD24bAE",
    "0xf5c2087877218AA979Dd0e2e5108837199aF44D2",
    "0x529dc928E67D8A43133D10769B308F1D5A629401",
    "0xF1bb436c29E46B1987bC825879ffc9c34Ab97f99",
    "0xFDDE7aE208B3596f1982D66F6BAe4cDabF29244b",
    "0x02e4Cc9ffF7566563618fb21B3BB10Eab4B3D726",
    "0xd8821dbbcb8ea0c14Bd1F0aCbFBeBB3Fd984269b",
    "0x31d23825aFbda5B6B1690Bbdbbb8117B5ea0f8E4",
    "0x731022D6De647991864203a35dFaD1A192240d07",
    "0xEb5e0B8e80FCe271c13F533fA728D7bB03cafa4c",
    "0xFC967DE4e029fdcD16B418DaC2147d282C93085b",
    "0x801a6d6dBC1e40466E131aA21D951629A9efAB4e",
    "0x4892139De0e73141438D9E55D593171C0Cc6B143",
    "0x8124eFC94c951cF41D4B0B42794C678458a00726",
    "0x81cc36DdA894256aa95458F78B4029381b09BDfb",
    "0x4Dcb2BCA3450B427F3d1b424C885259D05363080",
    "0x7Dd8030F9d33Af4a40ee074f990892E825132e61",
    "0x432C53218A11bEd08d238Cf84ff547CE4fe933ab",
    "0xE77ad9c5af60332D24E5531B51A6B7f61D0B8703",
    "0x0f792e55668AD78476d4B563E6EB1228D636a71e",
    "0x583bBaDA56bb535BCBb31877A620A6ff2A25CeA5",
    "0x5C0E777dC8F3De6b0911b44DbBDD8Bf71b2E8e38",
    "0x8a4a50B13Fd2cb36FeB96c408CB98B4c9F2b8F25",
    "0x1e55C85801a2C4F0beC57c84742a8eF3d72dE57B",
    "0x26d3bE736aB6b5D8A3266fFCC0895dDc1bc19a38",
    "0x809C9f8dd8CA93A41c3adca4972Fa234C28F7714",
    "0xfB94f39B150Ae661F85762154c0CadC65E083791",
    "0x4B7C0Da1C299Ce824f55A0190Efb13663442FA2c",
    "0x77E64560Bd6C323c075F206a5AB9dD6850F31609",
    "0x0F46540678c7e6D2eF983B382CC07Fa815AB148c",
    "0x82073f802547fEeEc0fd49719a3D7697fB66076a",
    "0xBAab83De8DbA764bF02a530cad33555bD23eba22",
    "0x890a0047f8D573347872cB6C019F86552f2367d6",
    "0x14D92832265eeAFDEF9e526356FEfc90105966c3",
    "0x512B436cB2Ed6016e80d4F89ca578F99DBBccb61",
    "0x696Ee4AE0b15feae8ED1AfC865930e0ea65b1f3F",
    "0xbb4D885fD41c807e8eCC2dD9e6295a7F96Adb0EB",
    "0xB1dE969883b1FdD90a43fF475A5171a3CfEfe76d",
    "0x7DBF6820D32cFBd5D656bf9BFf0deF229B37cF0E",
    "0xfE2e3cCEE9714b29Ab2FB4E940e52672194815fC",
    "0x57fb3f4b027fbaDbd8d20Eb5E48feb1e2b02DF30",
    "0x9AE494FBAc34682c122A1D4e3D6ae1Eb5404A469",
    "0xb2b9300475aF157676C44eE64d39a5eB3C294DbD",
    "0x01Bc28E036b6e75247Fe8F49f0a8b9410b19d851",
    "0xcCE9A28b570946123f392Cf1DbfA6D2D5e636a1f",
    "0xb2a3b5B9d2C0f07cBA328b58737147cfc172EB9f",
    "0xCC3d7F9fE6946979215A901BbA385a88FdabBBf4",
    "0x38f80f8f76B1C44B2beeFB63bb561F570fb6ddB6",
    "0xd82803b7B9A5EB1D5FC558FD619afC6c031cd0B1",
    "0x844AeeD1B294Ef9632c18E73F57ef77D0A23D0e2",
    "0x9cD7D1981B3e15a2DEE4d512ac60E0579Ae18546",
    "0xEBCd250474C27cBaD3C56f3F34e08F97b370AC2d",
    "0xDA47bdcC48f26FB4709f90316341D9104cB1fb89",
    "0x5cbB6ad79008908aA125667D1300558D9253B589",
    "0x1078DaA844CDF1EDB51E5189c8b113B80a6A6957",
    "0x8341c4106523b49fc247f84e412Bb2AF5597038f",
    "0xCe57ebEd9aC38402DcAA44f65a1c9b04e26b8283",
    "0x2dd2036C9Db2ADA2739509AF0047c00C8b9291EF",
    "0xa77294828d42B538890fa6E97AdFfE9305536171",
    "0x8dA48e5846c06B558970ACd42EDc7Da8799481E4",
    "0x50418699cB44BfDa9c9afc9B7a0b0d244d8927D2",
    "0x936d69AbCD9acdC89455EEFAf744044fFC1CA660",
    "0x90C32e6B29794Fd7f5BbA2BBEE74e924078B3f9b",
    "0x362B7e0599E950b921ca9D86336ca409208FFDEC",
    "0xd98aD1Fd4aa0E1c876d91968D1385aa9E1Aa98df",
    "0xD2602C7bDFC9F413974e944280BbFae275d1B1b6",
    "0x731A2e51ebfAeBacF8477E992CDEB1E8eacf519C",
    "0x072d63796C4FE69B306a23E1D01156d51F7B3e16",
    "0x051010142A0B9de7F0Fd8fb31d085407287F6381",
    "0x8498843f6D9046f7b59482978E152D61869203bC",
    "0xB48ef8e4e7Bef79ddF64d4424151f003a59BfbfB",
    "0xb423A138fD171c28d90A5883A01ec92fF3D63609",
    "0xAfA3a2528E8baAd576a83ffC52dB9f100dEbe307",
    "0x055fdA7Eb509cc338C898b0F698B7624387AB813",
    "0x0B3BD83E857997b370FaDC8504fB712244F6786C",
    "0x8D12A71Cb933A4222d42feCBb4ba9c15e455305b",
    "0xDEF3D19ff35a42F5b8E3c706c8fD287De72e6D15",
    "0x19a2BC678785BAD6A947A87494D480DAD57711c6",
    "0x2c3E79D3DCE90FB0886C89Ec602E61757E589a94",
    "0xe8aa836a597a66724D678860D105561c13E95bFa",
    "0x3352a3277d2B74A773Fa6E68a625FcB18E4Fc282",
    "0x2df292AF809Fd693D94C7D17E36BE352e15Bb98a",
    "0x269Aa10398Aaa695259C3E8211ab27a15004110C",
    "0x02d9c84a495986b8b3C3347Ad16849DCB1b9793e",
    "0x8FDA1Daa6a674C1726d1896E3054B9a82d123F12",
    "0x1021e61f2cDd8bB295b0e64A20eBB7D8ec3734bf",
    "0x58d7d9c971A613117E493062bEC1A6A5484f2780",
    "0x2bb96f44b9709b02189A50B377755edC30bc65C7",
    "0x7bE20B02095944657275eD608615A39931d783F2",
    "0x4AA51a723882ee676FeC444D4561c5eE16c339E9",
    "0x1B243D42F53924118646EFaec5b3f6116b563960",
    "0x01b7348EC3fb20Ab1f40b97Cc82df44aeD360768",
    "0xbf4C0104dbfb028f3484CfAC17BB22aa15E5c7E2",
    "0xCc3B817D4ABa7698EaafB4C68E7688CF61B0BF46",
    "0x572E1b86471c900Cd16AFa9cBB7701862D0e70cB",
    "0x602Ac8C3f61b351be325FEeb58842EF557431c2e",
    "0x8d0CD1AB81EaDa4F92C7cb5c8DBc25C69cc296AD",
    "0xAE2C7AB762317DB453317b70f1f40145755fAfb7",
    "0x7bdae9AAbE238188c4882D48a3aEE21288A38eD0",
    "0x96e4152f00894f677d860023b9784d578bC1c145",
    "0xF572C9b11E757d3580C7C7310630cd488E8EA736",
    "0x3769092DBfa6eb34434fB5B7cf0eB06E710728F3",
    "0xCA72c93172BA6EfF168E59e7F17C3C7A8FeA9B62",
    "0x1c0AcCc24e1549125b5b3c14D999D3a496Afbdb1",
    "0x7fC80faD32Ec41fd5CfcC14EeE9C31953b6B4a8B",
    "0x5d36a202687fD6Bd0f670545334bF0B4827Cc1E2",
    "0xe64113140960528f6AF928d7cA4f45d192286a7a",
    "0xf6B6F07862A02C85628B3A9688beae07fEA9C863",
    "0xD779aFEE481e3Df5cd0544F0e4353Cf534FD99Db",
    "0x183bDB344A07Ee3D27f07AC4799A56E4A2fE5439",
    "0xA8cadC2268B01395f8573682fb9DD00Bd582E8A0",
    "0x75535661Ab25a468Dfb3137320a7568FeCda4832",
    "0xd37ED782323A82e5BD55A92500E48FF5eFcc415E",
    "0x03bB5bC3c8fdAB212A6b2B347a049133DfCB3A47",
    "0x61987699055394c65355F2797D3e4e589f7FaBf4",
    "0x2bC12061C8912505978472C21d4a23dB43AF62aA",
    "0xad7575AEFd4d64520c3269FD24eae1b0E13dbE7B",
    "0x0D89421D6eec0A4385F95f410732186A2Ab45077",
    "0x04c0cD38B8c203b14ef2b7B8d736D69B938AFF71",
    "0x0CF30daf2Fb962Ed1d5D19C97F5f6651F3b691c1",
    "0x6EEb37b9757DcA963120f61c7E0e0160469A44D3",
    "0x616caD18642F45d3fa5FCaaD0a2d81764A9cBa84",
    "0xdC1d963D21C9c1bFf7b6Bea6e10080dAa9b4fc51",
    "0x8073639B11994C549eDa58fC3cd7132a72aaDF10",
    "0xe52C39327FF7576bAEc3DBFeF0787bd62dB6d726",
    "0x8f21bD39FcAeA3A729D46339A383081ecB7E84E0",
    "0x8Fb7087336678F36E42313f6130567A109a8e73d",
    "0x276E69CdD336001afEF07075859A93078496C3c1",
    "0x954F716e6de059360d278B773138f8e046696721",
    "0x997D410b26CdD17b0750F2c1751e59cBcfaE446f",
    "0xE8b6b71f3b1E6d2ad406D2cf36B1f2C567342dF1",
    "0x83108A0653a14EAeB8301E7b10a37CfAc39C82f6",
    "0xF95D9549b3Ab9470d306a6413Aa45082e8B66043",
    "0x82d92494f6fFFB17A1DDFfd9B7d88D1d0a360009",
    "0xA19947DA8B916f64Ac6F362cEC9001D8BCBeEe93",
    "0x7ef5e4062dcCaD29A6F8d5458590160536056C81",
    "0x653d973b36137A5cB2fc304996E0af1F1afCC628",
    "0x5F319CA6Ecf072A4d183edAa711Cd04dC225df19",
    "0x4D32D90D6535bD4e7eaBaa27EE72932cB214BbfA",
    "0x73b9f6a6e52aCE2797F0a6E52AAc530Ed1F2a2Af",
    "0xaA3600788b72863ff51C8f0dB5F10bB65fbFeAB4",
    "0xf93F0b770784602fC3079eb1D2fB1Ff488Bb02B0",
    "0xC8Ddd59c496D04C4C060Ab5038d03d661DDC2617",
    "0xc42c77b6B2A2B220b9502F357bBf51334Db3C93f",
    "0x2615214F8200B526a7B1eACe03971F2672B48CF2",
    "0x9d8d7220D060fd12Ca33336B7239688e366327dE",
    "0x9e602c1920443F01Cb100a57A7F894df8Eb42f66",
    "0x7e651F5f597436cD0fa941F5FF2cD45Ef3F2Fda8",
    "0x8e30Dc2AEF957B1F7dd67B1b7bC651fFe7E17a06",
    "0x597dC4159a4b85c086c3C679a0B6c8Fe2836886F",
    "0x7fBdE8B27D2B4F164B66F2a9dc02bbD6697e5b19",
    "0xf5819cC26F0481c9b86294B4c24027518a04BD5B",
    "0x8e7D20638947132B0e6E1aFdE2da1B103aFF9280",
    "0xCBA711BEF21496Cfd66323d9AEA8C8EFd0F43e9d",
    "0xdfBaeeF21396BF205D4B7D23345155489072Cf9B",
    "0x3B981fA5dD50237dAb6F96A417A6690B6f20FcC4",
    "0x6C31212a23040998E1D1c157ACe3982aBDBE3154",
    "0xCDdF772F8A3295C89DC37510E16e360ee2d29789",
    "0x002B5dfB3C71E1dC97A2e5A0A7f69F3e7b83F269",
    "0xAD7A185b2456d5AFD85838A50C7d8aCE3aB2f871",
    "0x7993F18C91A9f68593d308C5846f380A2a374F46",
    "0xc5d82775c9bc5272B1225DB8D62b7034e064BA91",
    "0x8bfcF8cb383149D4Ef37e7A609cEc195CDCbE099",
    "0xA515F7fB260095eebC860425493b8761B4FC9abd",
    "0xaA95cA26c92b0634dF7a1A1504f579F13bFB7f9d",
    "0xC2812325caD4C4C782CbbC1164e9373371D31dB2",
    "0x4831DdB6502ca45dbEEDf58B47292061Cdb6050B",
    "0x6733c60E6E02f9C8FA221Db1aeA018d80D949861",
    "0xCaD3887923B39cD2b0B6d13538C4ecB7C5EE9825",
    "0x4520cD8BC085B962eF8c0ec696ac9D3Ef1d8bf55",
    "0x7D85fCbB505D48E6176483733b62b51704e0bF95",
    "0x27259b0F4209e76f8C6Cf27106C9FF83BdC2E831",
    "0xE04885c3f1419C6E8495C33bDCf5F8387cd88846",
    "0x23ee51e614cBF138e4cAbA9EC5ed4fF7D27A8596",
    "0x2cab4d881962D247218356B32aBc4AA5c46bA0d2",
    "0x1c0A032954f20761E59138feE236204bECbb8bdb",
    "0x701d0ECB3BA780De7b2b36789aEC4493A426010a",
    "0x1Ec3C1f70E1D6bBDC84092ae86eAaDE495fdDB9b",
    "0xB53b0255895c4F9E3a185E484e5B674bCCfbc076",
    "0x770569f85346B971114e11E4Bb5F7aC776673469",
    "0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab",
    "0xdca6F7CB3cF361C8dF8FDE119370F1b21b2fFf63",
    "0x117e1EbB7D05545064850513021dF6ADe3C1690B",
    "0x7fb43C99a26a9EA8ba841d58390BF1C2996EDFB0",
    "0x84B5a60Df2d7e3397B3A4A3c6282f090304Aca26",
    "0x72F434Fa010929656AeF58695dab85447E51Fbc6",
    "0xA29b0D2F3b4555359A1bF684d700753b1b06cBc4",
    "0x4318cC449b1cbE6d64dd82E16abE58C79E076C2B",
    "0x8F48282e50B0210bd7c7DD69C54205E98b9Ef5D9",
    "0xa305B293e44A82f3Cd489b5fB26084647bb5D8ae",
    "0xd9e5De13eF1dBC4DFE0Ee1BB76276228b9B23d0f",
    "0x4AcEEB7bF9ec8104CC2379f1E8D648Ee47249FCb",
    "0x0743542070891051861f8D0a4550f97B43B0B89a",
    "0x58aD805f26272C5Ba06D24Bd0E43c8a2d1c634D9",
    "0xE6ED9C681967a4EA7Cef4486942b800139DfB000",
    "0x51b9C1Df35B044b5c0099D1fD07EAb7cE38f325d",
    "0x55DFFA17578e6bAcE42e4Bf8687A11A85cCfEF97",
    "0x1FAE8f99E9F932BdBA910061590C2156eE512A91",
    "0xA25207Bb8f8EC2423E2ddf2686A0CD2048352f3E",
    "0x746bb7beFD31D9052BB8EbA7D5dD74C9aCf54C6d",
    "0x38bc91AA6Aa434c4fae7E666F68C859292deEd95",
    "0xA3aD5CFb4FF4B68e37A338Da200BA441C1850B5b",
    "0x4bfb2c232F70c83136a3F206cd26Df2A0B605cEC",
    "0xf5AB6B4a8d578807491ef59cE855982990932617",
    "0x1Fdd220E14b59E26bf1888e8267C4C221983a0A6",
    "0xE2D6AFF297b41881c1aEA9599F68AEDFAB38C651",
    "0x7d547666209755FB833f9B37EebEa38eBF513Abb",
    "0xb681B19bb1F7e9F3C2AE0EDeab368c2afaa4e590",
    "0x7Eb84E42059F0D44269C50f4D3A280Fd307a6824",
    "0x84f0620A547a4D14A7987770c4F5C25d488d6335",
    "0x4Ae6a8A28c87b75e935a90D6128F2649C969c0D8",
    "0xb79223E868871DBAc27E8E301f73734abd4Cc628",
    "0x6F219Bd1167568aB67494A9067CbbB5679bf0022",
    "0x9Ff548c1B3eA3dd123AFE39C759dDA548009B6C8",
    "0x3085051F89666E7124e7Ab95b693Fc1E09770907",
    "0xa25211B64D041F690C0c818183E32f28ba9647Dd",
    "0x6166E1964447E0959bC7c8d543DB3ab82dB65044",
    "0x76E059C6FF6bf9FFFD5f33AFdf4AB2FD511C9DF4",
    "0x4CC9E6fABb800F083a2685501d1A30CdAbb4B2De",
    "0x5f3371793285920351344a1EaaAA48d45e600652",
    "0xAFE2b51592b89095A4cFb18da2B5914b528f4c01",
    "0xe3F4F3aD70C1190EC480554bbc3Ed30285aE0610",
    "0xE0D8926A51F9A1dD8E089D9a3DD88F88fFb2F1Dc",
    "0xa6c366D97cb64708211f24310dFAd5363BC96a04",
    "0xB7562F12E41C762CeCDA99d62Bd6EAC7b0C3B4c1",
    "0x301605C95acbED7A1fD9C2c0DeEe964e2AFBd0C3",
    "0x5d47e5D242a8F66a6286b0a2353868875F5d6068",
    "0x0ea26051F7657d59418da186137141CeA90D0652",
    "0x88f1706c20d94A4d1551C5F799C9E3380A24C3AC",
    "0xFB40932271Fc9Db9DbF048E80697E2Da4AA57250",
    "0x40Db8365d1252bcb06598927698238a99D39228E",
    "0xaCf4C2950107eF9b1C37faA1F9a866C8F0da88b9",
    "0x144c4E5027B69f7798B2B162D924BcAE5c149f15",
    "0xeeE844540644b204f0005c063Ae95F244BF06a84",
    "0x014607F2d6477bADD9d74bF2c5D6356e29a9b957",
    "0x1E8eE48D0621289297693fC98914DA2EfDcE1477",
    "0x4AdA1B9D9fe28aBd9585f58cfEeD2169A39e1c6b",
    "0x31460f49EEA93Ef8255b42be019FB96F89Cf0c49",
    "0x63A32F1595a68E811496D820680B74A5ccA303c5",
    "0x022ca32d31da3Ef85922AAFD9aD29C5b2418172C",
    "0x93B109C3c279bcBbB673Ed1ae1A8BB2dE8eEf9da",
    "0x689476323Eb5e9A5DEd342F54B562fc2c156A522",
    "0x1C9F765C579F94f6502aCd9fc356171d85a1F8D0",
    "0xe0144FA05A0d32B5B1De10CcEe7211616B3E3EF0",
    "0x6C965b656C450259a6D4d95A2E68Fb4319EecBc0",
    "0xE36BD8C15a83b89E2E49806d7312846069755C63",
    "0x59DDA36bD196Ec849838CE2163E6821f946b37Dc",
    "0xDd31dB93082a3A71b98D37ba26230f8734Bd63C3",
    "0x83c98211C50480e457a0dF930d2A56a891BC4d4b",
    "0x11FA934f6754076AEb7Cf0A72a1c2D2518aA4C77",
    "0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12",
    "0x2383A8b8cC8561a65871F1d2783B7C52e22B62c1",
    "0xCED608Aa29bB92185D9b6340Adcbfa263DAe075b",
    "0x841AD0AbAb2D33520ca236A2F5D8b038adDc12BA",
    "0x76d2DDCe6b781e66c4B184C82Fbf4F94346Cfb0D",
    "0xf21e38ac177B48fDE02dB7F2CA97466AE8Eae87D",
    "0x7537Cb0AEe6a3483a7601ebf1084eD4df73166Ab",
    "0x5f0bD06A71E038206ef3e5090eB448E9a9773772",
    "0x3C0c7B44c1F9366271F5c491121a1F7d55d33eF5",
    "0xa96a437eFb71bAF50A59027C340FA3362ef703F7",
    "0x55bA9c90c37e3206570AC9dc872c0f053d155F77",
    "0xC68bba423525576C7684e7ea25E7D5F079b1361E",
    "0x78E87757861185Ec5e8C0EF6BF0C69Fa7832df6C",
    "0xCb36F8580A36788A48518dEC95Ea458357E64E30",
    "0x25854e2a49A6CDAeC7f0505b4179834509038549",
    "0x639749b7b08aEe65039c21d8a411103C6ceBEBF0",
    "0xF517529866d371F04780885923F739bc17694BFb",
    "0xC728DEa8B2972E6e07493BE8DC2F0314F7dC3E98",
    "0x33f6EE932cEa603Fafd6854827259bE172C91Da4",
    "0x6D97d65aDfF6771b31671443a6b9512104312d3D",
    "0xB7BaBe35CE543e2Cf2F615CB1c792a2025feb572",
    "0x4D9e86a5AC368Aa4Df0473eF07e13Ec2Fbe04025",
    "0xaa79B87DC8B046A5E4f7D03F1562D7fe5BF98737",
    "0xE71FbB197BC8fD11090FA657C100d52Dbb407662",
    "0xB22981bA3FE1De2325935c91a3B717168fB86714",
    "0xf389dD1F828525b449D63D14157f2d3A25eE0a41",
    "0x877B37D3E5467B4aAE7687Dd3480A46C8D3e16Be",
    "0xf9e1D1e9F22c96752356AdFd377231528c7E851E",
    "0x187089B33E5812310Ed32A57F53B3fAD0383a19D",
    "0xF1659A2FD5007192314F9676e6a4a39FD1202160",
    "0xFdd210ce1b829E837D9e034DAE0F0312F176cef6",
    "0xaCE1f1c6c5c89AE3Fc3209ff92e7120fb74445aA",
    "0x6Ceb397b68059Ca73049874D0a30c62500aE9877",
    "0xC46c67Bb7E84490D7EbdD0b8ecDaca68Cf3823F4",
    "0xbb2eb4c7eB36ECce7A3E6bc501590CE12c9c1050",
    "0x9Cf251A782cE7310D5bec0fe0a1C2B826d962545",
    "0x43930Ff04D18a5B59805151c1Eb403C55870641E",
    "0xA270f5649A42feDfE66ddb3b0b50bebAe1e3DDB0",
    "0xd3488EA0c1DC99a5d72F75c84004224f8b58694E",
    "0x7aBa691D12D8eF8793F1643eBa66b69C70EC72f1",
    "0x8558f502887a9a52c4B265d72327E0E529Ff790d",
    "0xA906c85B7e809b79c5e69d485693B44d65B1B252",
    "0x3abdC9ed5f5dE6A74CFeb42a82087C853E160E76",
    "0x30C7F4F7504D6366916f669cd8E731ED4dF6C702",
    "0xed8DB37778804A913670d9367aAf4F043AAd938b",
    "0xc191a29203a83eec8e846c26340f828C68835715",
    "0xa32aECda752cF4EF89956e83d60C04835d4FA867",
    "0x059F7da59Ad1EB412B4d2fFc12E9B50Da91cFdb6",
    "0x85BEad65c61dB8cF230b3ec30552B8b3E6388570",
    "0xF3Ad97364bcCC3eA0582Ede58C363888f8C4ec85",
    "0x3F87755E2974534888Ddb20A52dCE45Ef9f204AB",
    "0x757CC91CcBB88cB0d78d6798D20051d39E5A7296",
    "0xF553C8223cA8542Af9Db7b916Fe9dc7c28b73751",
    "0x40f9bf922c23c43acdad71Ab4425280C0ffBD697",
    "0x9600e2eE6377DAdad7299B120026661c336A5e6d",
    "0x516fCA170bfE24BFC54e01F215EF85Fe9B5B798A",
    "0x61C820e261717A5A0555488872F78ac7b9CE77Ec",
    "0xEb263241eB948Cc0eB53A58bf743289D074F474F",
    "0x841C11b14c428dd591093348B8Afa2652C863988",
    "0x3c114973c0260290C2dbD40323327d996972FCeB",
    "0x765a16ca391A6b9249cfA65bf2D14C38722198e3",
    "0xC3268DDB8E38302763fFdC9191FCEbD4C948fe1b",
    "0x6B92686c40747C85809a6772D0eda8e22a77C60c",
    "0xc799bE8De03F20B2D3b101E6F6516D614e6fFe06",
    "0x40Dc654af5cE40C122ffDC679fa8E8ca8b91556A",
    "0xCE8D52c38d74B77a0aA361c48Fdce6b220A3370e",
    "0xEfa4c696Ea2505ec038c9dDC849b1bf817d7f69d",
    "0xf7253A0E87E39d2cD6365919D4a3D56D431D0041",
    "0xcf79C7EaEC5BDC1A9e32D099C5D6BdF67E4cF6e8",
    "0xff75E131c711e4310C045317779d39B3B4f718C4",
    "0xdE2BE7C9C542c55a7a77489A3A7745493988947F",
    "0xFeB3E0f50107f6cfB2EC8C2bC8287f2707E0E2Ea",
    "0x6b759Bf480407D19c8903c16023c706868c29a2A",
    "0x6E38911dA6Dd0379F1CaC396F74387c95A1f0D21",
    "0x5a5D9aB7b1bD978F80909503EBb828879daCa9C3",
    "0xe96056A9936C58e89D1703cF6bD97F134341EE44",
    "0x4dD6720D2Bb8721A46bdF9a528704164578E03B9",
    "0xE83B9A1B9056B21a01b85162E77AD76a42A1c64B",
    "0xbeC48f1cCf82d8e4C983Ee00Ac2eC6B03B81d710",
    "0xEFEdaf9c07E6eB56BB8F82f30018e4461B1c5F4c",
    "0xB68da7fbF71383Afab240839287878539cFFf20b",
    "0xfBDDB719cC7c795a1D9b7EA7aC11494A19b3231F",
    "0x07506a5F48D71fDB34D3900fB086D43EF1B58FF9",
    "0xa85cdd5478B7E525a808eF9707c3e33432cE1e7F",
    "0xCf7C21DeD40f2Df85A564207A89b3379780d9CE3",
    "0xd26b76e50f6510cdD4bf45d59279705f36946d23",
    "0xdb7a41e39807E8C988859f150296Db92674b7dc7",
    "0x719028736f10164c838Ef129936779eD739312f2",
    "0xaBCdef0AbbA5D0106595174213156797bc0DB33E",
    "0x3D2b8879f97e413b2609F9844A5fc8dB8FE4f6F8",
    "0x81EbE8Ee7b51741fD5DaD31F6987E626A9bb8111",
    "0x1D45c8fa65F6b18E7dAe04b2efEa332c55696DaA",
    "0x978eB534b26CB8749D352a2C94EC21e659e4248d",
    "0xa7CA400d49BBa87EB606ee05af93689BD21FaB99",
    "0x65ad2BF7E09af2597C140dF6386a3003d0F5f8Ee",
    "0x835918a3fBDf946364a9aee3114173865b712663",
    "0x6073cFfc1D46b1eA57BA89A28074cA734aCD7003",
    "0x2B13D52dFd33E2eBd13232866fDf96088e77d596",
    "0x55F5601357f6e0B10a3386914c93916c6C9A368A",
    "0xA1D5D2d931b532A0503e97f540f65ed256f374e6",
    "0x6C9258895FFBE2178b3EdEfE09AF304a1e99bF2F",
    "0x973375b099943cDdFd390022CeA90D4F1d0c493c",
    "0x8A8C879D39A74fCE0593714956bB7Ed048A5c1BF",
    "0x9c42B0c70D0dAF1211f3aab2A1E6EC5E717dE12a",
    "0x81a6383041593c556d1c8e69e2749b35b5008F09",
    "0xF41b98a4C32bB61468C8001E0C69Ef64ce6DEa57",
    "0x8FaE81bb674c89cCDE35a386587333D074b57786",
    "0xa8258ED271BB9be9d7E16c5818E45eF6F2577d92",
    "0x1e90474D2E83e7B7dD45553156Beb316845E66A4",
    "0x2cCbbC4c10F5d807FDd447219B57D0b883a28DC8",
    "0x1bBeAc736875c5043486A8a4374E6B5616eC8883",
    "0x95add3DfEF3AE0A832607Dc71C4A9C6A6C2D7Eb7",
    "0x744c6Eed427aF293b0106B46700fdDD3C9f62Eef",
    "0x743Ec55fc166D24D2FD0211fb6Ce53926D0Ff3b1",
    "0xDd03d2434C02c6BfFb097b7130528F9568b6C70d",
    "0x97C12EFA574923E3ee445370d2dE432332857110",
    "0xB69951a0642b55CD5731535ed5B290Fa49D3454A",
    "0xBA56878729540404dE2aa14561b451aE2350744a",
    "0x8D247f4Fbbe81429d3D164a5c9Ae0063210edBdC",
    "0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d",
    "0xfE1552DA65FAcAaC5B50b73CEDa4C993e16d4694",
    "0x9705FE3586a7D768Fee061aAfE9384b1D4B8F2D8",
    "0x5554672e67bA866B9861701D0e0494AB324aD19A",
    "0xacc5c1e73d70F7F9622De2d574885Ce8E6981033",
    "0xbe9E7b0ed19526544B55b697107231f9467a805f",
    "0x172DBab6f5E62A1FE7E2bA5eA1624ADB33e0aa14",
    "0x96725Fa2F9A0b5bAf80fC36C20C2cA79d86424ed",
    "0xa392cCadABFf735dbFF69dC93d7C13f34A30611b",
    "0xEbF0e04E47F726D0f44801dFEC5e705aDcd6694b",
    "0xC0891e8FCeA09680BFe9170809fad1BCCa10b96b",
    "0xA21000E7A5A2A2Bd9329428A859f9d7dcE0f0961",
    "0x9A387307F7508DE113092BaFC5CB4B3AE0706521",
    "0xBA719E0197470A790726075fD98EDEF04E2467af",
    "0xda08BE028304db1A73a13Bce7C943127C2E393dB",
    "0xfB4a965A35603010FeAcC648cA022Cb6A12D33F5",
    "0x3Aa73ed90e9f0CEd87ff99CB60cA79019279e6CE",
    "0x150bB505A9259b0be44FFb15415C79199E83c445",
    "0xB170A41F2523220A12F84f17A54bD31953D98027",
    "0x2Fcd65d9c8078644adCf1CB0cd70A1b61F3F9C5b",
    "0x73006C818880d07dD510e165C3De3E74F2407187",
    "0x747e6ABc102222f1dF65C662540dDf471241a644",
    "0xeeEe5D271A56Aa09C4F8862aF514ADD3E882857c",
    "0x98Ad82AB467bc8c70e0CC183a5826d903751b7d8",
    "0xC624434420f6CbE835D6358A8223b78432773cEd",
    "0x848e313d4b25bC0B48CaFdB6A72391E892E6A247",
    "0x0025Ab2d69F6c2C3Ffac32Ab6A16e18c807518B8",
    "0x2efe744ecc4F6BD55538da57D09DAE895C95b223",
    "0xBc6d82D8d6632938394905Bb0217Ad9c673015d1",
    "0xe1555c6EE61366a3f90135Dc704Acd25C3247ACA",
    "0x2f51E78ff8aeC6A941C4CEeeb26B4A1f03737c50",
}

TIMEOUT_LIST = set()
TIMEOUT_LIST_NOT_MAINNET = {"0xdf486eeC7b89C390569194834a2f7A71da05Ee13"}

GUEST_LIST_STAMP_PROVIDERS = [
    "AllowList#OctantFinal",
    "AllowList#OctantEpochTwo",
    "AllowList#OctantEpochOne",
    "AllowList#OctantEpochThree",
]

GTC_STAKING_STAMP_PROVIDERS_AND_SCORES = {
    "SelfStakingBronze": 1.0,
    "SelfStakingSilver": 2.0,
    "SelfStakingGold": 3.0,
    "BeginnerCommunityStaker": 1.5,
    "ExperiencedCommunityStaker": 2.5,
    "TrustedCitizen": 4.0,
}
