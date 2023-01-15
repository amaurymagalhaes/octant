# Hexagon

Hexagon is a community-driven platform for experiments in decentralized governance.

Developed by the [Golem Foundation](https://golem.foundation/) to test various hypotheses around user control, voter engagement, and community funding, the platform allows for running various governance experiments in a real-life environment and rewards user participation with ETH.

Documentation is available [here](http://docs.hexagonapp.xyz/).

## Configuration

Ensure that the `.env`  file is present. See `.env.template`.

## Clean
```bash
yarn clean
```

## Compile
```bash
yarn compile
```

## Test
```bash
yarn test
```

## Format and lint
```bash
yarn format
yarn lint
```

## Documentation
Generate contracts documentation:
```bash
yarn docs
```
Go to `.docs` and open the `index.html` file in your browser.

## Deployment

### Goerli testnet
```bash
yarn deploy:goerli
yarn verify:goerli
```

## GLM Faucet (Goerli)
Update `.env` with your private key:
```bash
GOERLI_PRIVATE_KEY=<your private key>
```
Send Test GLM.
```bash
npx hardhat --network goerli send-glm --recipient <recipient address>
```

## Known technical problems
### client
Typechain combines responses from contracts so that an array and object are joined together, e.g.:
```
export type AllocationStructOutput = [BigNumber, BigNumber] & {
    allocation: BigNumber;
    proposalId: BigNumber;
};
```
The problem with this approach is that the `react-query` package used for fetching and managing data from contracts does drop the latter object part on all but first after rerender requests. Hence, the remapping of array elements to named variables is required during response parsing phase.
