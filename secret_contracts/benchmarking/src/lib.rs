/*
  # Storage
  We do not store all state on a single HashMap, instead we store every DataSet seperately.
  This is so we can save gas costs, and avoid unnecessary serializations / deserializations.
*/
#![no_std]
#![allow(unused_attributes)]

extern crate eng_wasm;
extern crate eng_wasm_derive;
extern crate serde;
extern crate serde_derive;
extern crate std;

use eng_wasm::*;
use eng_wasm_derive::pub_interface;
use serde::{Deserialize, Serialize};

static DATASETS_LENGTH: &str = "DATASETS_LENGTH";
static DATASET: &str = "DATASET_"; // dynamically generated afterwards "DATASET_<ID>"

#[derive(Serialize, Deserialize)]
pub struct DataPoint {
  id: U256,
  rate: U256,
}

#[derive(Serialize, Deserialize)]
pub struct DataSet {
  id: U256,
  name: H256,
  datapoints: Vec<DataPoint>,
}

type DataSetsInfo = (Vec<U256>, Vec<H256>);

pub struct Contract;

// returns a DataSet state key, ex: "DATASET_1"
fn create_dataset_key(id: U256) -> String {
  let mut key = String::from(DATASET);
  key.push_str(&id.to_string());

  return key;
}

// secret fns
impl Contract {
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
  fn get_datasets_length() -> U256;
  fn get_datasets_info() -> DataSetsInfo;
  fn add_dataset(name: H256, ids: Vec<U256>, rates: Vec<U256>) -> ();
  fn calc_percentile(id: U256, rate: U256) -> U256;
}

impl ContractInterface for Contract {
  #[no_mangle]
  fn get_datasets_length() -> U256 {
    match read_state!(DATASETS_LENGTH) {
      Some(length) => length,
      None => U256::from(0),
    }
  }

  #[no_mangle]
  fn get_datasets_info() -> DataSetsInfo {
    let datasets_length = Self::get_datasets_length();
    let mut ids: Vec<U256> = Vec::new();
    let mut names: Vec<H256> = Vec::new();

    for n in 0..U256::as_usize(&datasets_length) {
      let dataset = Self::get_dataset(U256::from(n + 1));

      ids.push(dataset.id);
      names.push(dataset.name);
    }

    return (
      ids,
      names
    );
  }

  #[no_mangle]
  fn add_dataset(name: H256, ids: Vec<U256>, rates: Vec<U256>) -> () {
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

    write_state!(
      DATASETS_LENGTH => id,
      key => DataSet {
        id: id,
        name: name,
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
