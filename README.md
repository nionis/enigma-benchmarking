# Enigma - Secret Benchmarking

## Stack

* next-js
* react
* mobx-state-tree
* web3

## Setup

### Secret Contracts
1. `npm install`
2. rename `.env-default` to `.env`
3. modify `.env` "BUILD_CONTRACTS_PATH"
4. `discovery compile`
5. `discovery start`
6. once started: `discovery migrate`

### Client
1. `cd client`
2. `npm install`
3. rename `.env-default` to `.env`
4. modify `.env` according to your setup
5. `npm run dev`

## Pitfalls
- After doing `discovery start` make sure you reset [metamask](https://ethereum.stackexchange.com/questions/44311/reset-metamask-nonce)