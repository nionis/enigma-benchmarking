# Enigma - Secret Benchmarking

## About

[Enigma](https://enigma.co/) is a secure computation protocol, where “secret nodes” in our network perform computations over encrypted data. Enigma brings privacy to any kind of computation - not just transactions - helping to improve the adoption and usability of decentralized technologies.

This application uses enigma's secret contracts and ethereum's smart contracts to allow users to submit datasets and compare their quotas privately.

Key Features:
* client enables to encrypt and transmit the dataset to the secret contract
* client enables to encrypt and transmit the user’s quotas to the secret contract, receive the correct decrypted output

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
