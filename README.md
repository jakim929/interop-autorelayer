# L2ToL2CrossDomainMessenger AutoRelayer

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

## Specifying chain RPC URLs

By default the chains are the following RPC URLs
- `http://127.0.0.1:9545`
- `http://127.0.0.1:9546`

To update, edit the `RPC_URLS` constants in the `src/config.ts` file.
