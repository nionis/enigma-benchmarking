/*
  # Storage
  We do not store all state on a single HashMap, instead we store every DataSet seperately.
  This is so we can save gas costs, and avoid unnecessary serializations / deserializations.
*/
#![no_std]
#![allow(unused_attributes)]

extern crate eng_wasm;
extern crate eng_wasm_derive;
extern crate rustc_hex;
extern crate serde;
extern crate serde_derive;
extern crate std;

use eng_wasm::*;
use eng_wasm_derive::{pub_interface, eth_contract};
use rustc_hex::ToHex;
use serde::{Deserialize, Serialize};

static REGISTRY: &str = "REGISTRY";
static DATASETS_LENGTH: &str = "DATASETS_LENGTH";
static DATASET: &str = "DATASET_"; // dynamically generated afterwards "DATASET_<ID>"

// registry
#[derive(Serialize, Deserialize)]
pub struct Registry {
  address: H160,
}

#[derive(Serialize, Deserialize)]
pub struct DataPoint {
  id: U256,
  rate: U256,
}

#[derive(Serialize, Deserialize)]
pub struct DataSet {
  id: U256,
  name: String,
  datapoints: Vec<DataPoint>,
}

pub struct Contract;

#[eth_contract("Registry.json")]
struct EthContract;

// returns a DataSet state key, ex: "DATASET_1"
fn create_dataset_key(id: U256) -> String {
  let mut key = String::from(DATASET);
  key.push_str(&id.to_string());

  return key;
}

// add prefix "0x" to address string
fn h160_to_string(address: H160) -> String {
  let addr_str: String = address.to_hex();

  return [String::from("0x"), addr_str].concat();
}

// secret fns
impl Contract {
  fn get_registry() -> Registry {
    match read_state!(REGISTRY) {
      Some(registry) => registry,
      None => panic!("registry should already exist"),
    }
  }

  fn get_dataset(id: U256) -> DataSet {
    let key = &create_dataset_key(id);

    match read_state!(key) {
      Some(dataset) => dataset,
      None => panic!("dataset does not exist"),
    }
  }
}

#[pub_interface]
pub trait ContractInterface {
  fn construct(registry_addr: H160) -> ();
  fn get_datasets_length() -> U256;
  fn add_dataset(name: String, ids: Vec<U256>, rates: Vec<U256>) -> ();
  fn calc_percentile(id: U256, rate: U256) -> U256;
}

impl ContractInterface for Contract {
  #[no_mangle]
  fn construct(registry_addr: H160) -> () {
    write_state!(REGISTRY => Registry {
      address: registry_addr
    });
  }

  #[no_mangle]
  fn get_datasets_length() -> U256 {
    match read_state!(DATASETS_LENGTH) {
      Some(length) => length,
      None => U256::from(0),
    }
  }

  #[no_mangle]
  fn add_dataset(name: String, ids: Vec<U256>, rates: Vec<U256>) -> () {
    let registry_data = Self::get_registry();
    let datasets_length = Self::get_datasets_length();
    let id = datasets_length.checked_add(U256::from(1)).unwrap();
    let key = &create_dataset_key(id);

    // datasets length must be below 1000
    assert!(ids.len() <= 1000);

    // datasets arguments must be equal
    assert!(ids.len() == rates.len());

    let mut datapoints: Vec<DataPoint> = Vec::new();

    for (i, datapoint_id) in ids.iter().enumerate() {
      datapoints.push(DataPoint {
        id: *datapoint_id,
        rate: rates[i],
      })
    }

    // register dataset
    let registry = EthContract::new(&h160_to_string(registry_data.address));
    registry.addDataset(id, name.clone());

    write_state!(
      DATASETS_LENGTH => id,
      key => DataSet {
        id: id,
        name: name.clone(),
        datapoints: datapoints
      }
    );
  }

  #[no_mangle]
  fn calc_percentile(id: U256, rate: U256) -> U256 {
    let dataset = Self::get_dataset(id);
    let total_datapoints = dataset.datapoints.len();
    let mut below_or_equal = 0;

    for datapoint in dataset.datapoints.iter() {
      if datapoint.rate > rate {
        continue;
      }

      below_or_equal = below_or_equal + 1;
    }

    let mut percentile = (below_or_equal * 100) / total_datapoints;

    if percentile == 0 {
      percentile = 1;
    } else if percentile == 100 {
      percentile = 99;
    }

    return U256::from(percentile);
  }
}
