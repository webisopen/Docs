---
title: Task Specification
description: Learn more about OVM Task Specification.
---

## Introduction

In order to access high-performance compute resources, task contracts must conform to this specification. Note that the specification does not define the required runtime environment(e.g. `python:3.3` or `nodejs:19.0.0`). It must be included in the Dockerfile along with the source code of the computing task.

## Specification

```js
struct Specification {
    string name;
    string version;
    string description;
    string repository;
    string repoTag;
    string license;
    Requirement requirement;
    uint256 royalty;
    string apiABIs;
    Arch arch;
    ExecMode execMode;
}

enum ExecMode {
    JIT,
    PERSISTENT
}

enum Arch {
    AMD64,
    ARM64
}

enum GPUModel {
    T4
}

struct Requirement {
    string ram;
    string disk;
    uint256 timeout;
    uint256 cpu; 
    uint256 gpu;
    GPUModel gpuModel; 
}

```

| Spec Name   | Description                                                | Example                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | name                                                       | ovm-cal-pi                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| version     | version of the Specification schema                        | currently only "v1.0.0" available                                                                                                                                                                                                                                                                                                                                                                                                                     |
| description | description of the computing task defined in this contract | Calculate PI                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| repository  | repository of the computing task defined in this contract  | https://github.com/webisopen/ovm-cal-pi                                                                                                                                                                                                                                                                                                                                                                                                               |
| repoTag     | semver tag or git sha of the repository                    | v1.0.0                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| license     | license of the task defined in this contract               | WTFPL                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| requirement | resources required for the computing task                  | `{ ram: "256mb", disk: "5mb", timeout: 600, cpu: 1, gpu: false}`                                                                                                                                                                                                                                                                                                                                                                                      |
| royalty     | royalty fee rate, in basis points                          | 5 (which means 0.05%)                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| apiABIs     | declaration of the abis for request response interfaces    | `[{"request": {"type":"function","name":"sendRequest","inputs":[{"name":"numDigits","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"requestId","type":"bytes32","internalType":"bytes32"}],"stateMutability":"payable"},"getResponse":{"type":"function","name":"getResponse","inputs":[{"name":"requestId","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"}}]` |
| execMode    | exectuion mode for the task, JIT or PERSISTENT             | `JIT`: tasks are compiled and executed during runtime. <br> `PERSISTENT`: tasks require preemptive compilation to be executed instantly by available envrionment.                                                                                                                                                                                                                                                                                     |
| arch        | architecture of the task                                   | `ARM64` or `AMD64`                                                                                                                                                                                                                                                                                                                                                                                                                                    |

The Specification defines the computation task and its requirement of external computing power.
To ensure proper integration between your computation task and the contract, follow the following principles:

1. **Input**: You can pass any type of parameters to the computation task, as long as they are correctly formatted as a single bytes variable in your contract (the computation task will decode it as needed).
1. **Output**: The task must return a single `bytes` as output, which will be further processed and, if necessary, decoded within the contract.
