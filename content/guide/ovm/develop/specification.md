---
title: Contract Specification
description: Learn more about OVM Contract Specification.
---

## Introduction

In order to access high-performance compute resources, contracts must conform to this specification.

## Specification

```js
struct Specification {
    string name;
    string version;
    string description;
    string environment;
    string repository;
    string repoTag;
    string license;
    string entrypoint;
    Requirement requirement;
    uint256 royalty;
    string apiABIs;
    ExecMode execMode;
}

enum ExecMode {
    JIT,
    PERSISTENT
}

struct Requirement {
    string ram;
    string disk;
    uint256 timeout;
    uint256 cpu;
    bool gpu;
}
```

| Spec Name   | Description                                                | Example                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | name                                                       | ovm-cal-pi                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| version     | version of the Specification schema                        | currently only "v1.0.0" available                                                                                                                                                                                                                                                                                                                                                                                                                     |
| description | description of the computing task defined in this contract | Calculate PI                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| environment | environment of the computing task                          | python:3.7                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| repository  | repository of the computing task defined in this contract  | https://github.com/webisopen/ovm-cal-pi                                                                                                                                                                                                                                                                                                                                                                                                               |
| repoTag     | semver tag or git sha of the repository                    | v1.0.0                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| license     | license of the task defined in this contract               | WTFPL                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| entrypoint  | entrypoint of the task defined in this contract            | src/main.py                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| requirement | resources required for the computing task                  | `{ ram: "256mb", disk: "5mb", timeout: 600, cpu: 1, gpu: false}`                                                                                                                                                                                                                                                                                                                                                                                      |
| royalty     | royalty fee rate, in basis points                          | 5 (which means 0.05%)                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| apiABIs     | declaration of the abis for request response interfaces    | `[{"request":{"type":"function","name":"getResponse","inputs":[{"name":"requestId","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},"getResponse":{"type":"function","name":"getResponse","inputs":[{"name":"requestId","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"}}]` |
| execMode    | exectuion mode for the task, JIT or PERSISTENT             | `JIT`: tasks are compiled and executed during runtime. <br> `PERSISTENT`: tasks require preemptive compilation to be executed instantly by available envrionment.                                                                                                                                                                                                                                                                                     |
| arch        | architecture of the task                                   | `ARM64` or `AMD64`                                                                                                                                                                                                                                                                                                                                                                                                                                    |

The Specification defines the computation task and its requirement of external computing power.
To ensure proper integration between your computation task and the contract, follow the following principals:

1. **Input**: You can pass any type of parameters to the computation task, as long as they match the parameters specified in your contract.
1. **Output**: The task must return a single `bytes` as output, which will be further processed and, if necessary, decoded within the contract.
