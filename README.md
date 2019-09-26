# Enigma - Secret Benchmarking

## Stack

* next-js
* react
* mobx-state-tree
* web3

## Setup

### Secret Contracts
1. `npm install`
2. `discovery compile`
3. `discovery start`
4. once started: `discovery migrate`

### Client
1. `cd client`
2. `npm install`
3. go to: `src/env.ts` and change the variables according to your setup
4. `npm run dev`

## Pitfalls
- After doing `discovery start` make sure you reset [metamask](https://ethereum.stackexchange.com/questions/44311/reset-metamask-nonce)