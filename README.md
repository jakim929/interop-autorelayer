# L2ToL2CrossDomainMessenger AutoRelayer

Any message sent using `sendMessage` on the `L2ToL2CrossDomainMessenger` will automatically executed on the `CrossL2Inbox` on the destination chain.

## Getting started
1. clone the repo
```sh
git clone git@github.com:jakim929/interop-autorelayer.git
```

2. install necessary packages
```sh
cd interop-autorelayer
pnpm i
```

3. run the relayer
```sh
pnpm start
```

## Config
### RPC URLs
By default the chains are the following RPC URLs
- `http://127.0.0.1:9545`
- `http://127.0.0.1:9546`

To update, edit the `RPC_URLS` constants in the `src/config.ts` file.

### Private key for the wallet to `executeMessage` with
Currently only supports a single private key for all chains. 

To update, edit the `PRIVATE_KEY` constant in the `src/config.ts` file.


