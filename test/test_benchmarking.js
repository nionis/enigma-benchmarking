const fs = require('fs');
const Web3 = require('web3');
// const SampleContract = artifacts.require("Sample");
const { Enigma, utils, eeConstants } = require('enigma-js/node');

const provider = new Web3.providers.HttpProvider('http://localhost:9545');
const web3 = new Web3(provider);

var EnigmaContract;
if (typeof process.env.SGX_MODE === 'undefined' || (process.env.SGX_MODE != 'SW' && process.env.SGX_MODE != 'HW')) {
  console.log(`Error reading ".env" file, aborting....`);
  process.exit();
} else if (process.env.SGX_MODE == 'SW') {
  EnigmaContract = require('../build/enigma_contracts/EnigmaSimulation.json');
} else {
  EnigmaContract = require('../build/enigma_contracts/Enigma.json');
}
const EnigmaTokenContract = require('../build/enigma_contracts/EnigmaToken.json');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let enigma = null;

const compute = async ({ fn, args, userAddr, contractAddr }) => {
  let task = await new Promise((resolve, reject) => {
    enigma.computeTask(fn, args, 10000000, utils.toGrains(1), userAddr, contractAddr)
      .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
      .on(eeConstants.ERROR, (error) => reject(error));
  });

  while (task.ethStatus !== 2) {
    if (task.ethStatus === 3) {
      throw Error("task failed");
    } else if (task.ethStatus === 4) {
      console.log(task);
      throw Error("transaction reverted");
    }

    await sleep(1000);
    task = await enigma.getTaskRecordStatus(task);
  }

  const result = await new Promise((resolve, reject) => {
    enigma.getTaskResult(task)
      .on(eeConstants.GET_TASK_RESULT_RESULT, (result) => resolve(result))
      .on(eeConstants.ERROR, (error) => reject(error));
  });

  return enigma.decryptTaskResult(result);
}

const rawAddrToStr = raw => web3.utils.toChecksumAddress(`0x${raw.slice(24, 64)}`);
const rawUint256ToStr = raw => String(parseInt(raw, 16));

contract("benchmarking", accounts => {
  const [owner, user1, user2] = accounts
  let secretContractAddr = null
  let enigmaAddr = EnigmaContract.networks['4447'].address

  before(async function () {
    // setup enigma
    enigma = new Enigma(
      web3,
      enigmaAddr,
      EnigmaTokenContract.networks['4447'].address,
      'http://localhost:3346',
      {
        gas: 4712388,
        gasPrice: 100000000000,
        from: owner,
      },
    );
    enigma.admin();

    // get secret contract address
    secretContractAddr = fs.readFileSync('test/benchmarking.txt', 'utf-8');
  });

  // NOTE: helps with race-condition causing tests to fail
  beforeEach("sleep", async () => {
    await sleep(2000);
  });

  it('get length of datasets', async () => {
    const result = await compute({
      fn: "get_datasets_length()",
      args: "",
      userAddr: owner,
      contractAddr: secretContractAddr
    }).catch(console.error)

    expect(rawUint256ToStr(result.decryptedOutput)).to.equal("0");
  });

  it('add dataset', async () => {
    await compute({
      fn: "add_dataset(string, uint256[], uint256[], uint256[])",
      args: [
        ["server costs", "string"],
        [[1, 2, 3, 4, 5], "uint256[]"],
        [[10, 20, 30, 40, 50], "uint256[]"],
        [[5, 5, 10, 10, 20], "uint256[]"]
      ],
      userAddr: owner,
      contractAddr: secretContractAddr
    });

    const result = await compute({
      fn: "get_datasets_length()",
      args: "",
      userAddr: owner,
      contractAddr: secretContractAddr
    })

    expect(rawUint256ToStr(result.decryptedOutput)).to.equal("1");
  });

  it('get percentile of rate 20', async () => {
    const result = await compute({
      fn: "calc_percentile(uint256, uint256, uint256)",
      args: [
        [1, "uint256"],
        [50, "uint256"],
        [20, "uint256"]
      ],
      userAddr: owner,
      contractAddr: secretContractAddr
    });

    expect(rawUint256ToStr(result.decryptedOutput)).to.equal("20");
  });
});