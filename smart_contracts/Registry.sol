pragma solidity ^0.5.0;

contract Registry {
  struct Dataset {
    uint256 id;
    string name;
  }

  Dataset[] public datasets;

  function getDatasetsLength() external view returns (uint256) {
    return datasets.length;
  }

  // TODO: needs security check, see: https://forum.enigma.co/t/enigmasimulation/1070/16?u=nioni
  function addDataset(uint256 id, string calldata name) external {
    datasets.push(Dataset(id, name));
  }
}