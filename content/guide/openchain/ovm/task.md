---
title: Task
description: Learn more about publishing an OVM Task.
---

## Introduction

A task is a computation unit that leverages OVM's access high-performance compute resources for completing complex computations like AI training, scientific simulations, or any other compute-intensive tasks that are not feasible on an EVM blockchain.

Think of it as a dApp that knows the computation to be executed, the environment in which it should run, and the requirements for the execution.
Once a new compute task is published by a user, the OVM gateway contract routes the task to the optimal executor to execute the task.

## Getting Started

Let's see how you can get started with building and deploying smart contracts on OVM to deploy a task.

### Prerequisites

Before you start building, make sure you have the following prerequisites:

1. Installed [Node.js](https://nodejs.org/)
1. Installed [Foundry](https://getfoundry.sh/)

### Installation

You should use foundry to [create a new project](https://book.getfoundry.sh/projects/creating-a-new-project).

1. You can use `forge` to install the dependencies (recommended):

```bash
forge install https://github.com/webisopen/ovm-contracts
```


2. Otherwise you can use NPM to install the dependencies, there are two packages required:


```bash
    npm i @webisopen/ovm-contracts @openzeppelin/contracts
```

Modify the `foundry.toml` to include `node_modules` directory:

```toml
    libs = ["node_modules","lib"]
```

### Development

You may refer to the [OVM Cal PI](https://github.com/webisopen/ovm-cal-pi) repository for a sample smart contract that calculates the value of PI on-chain.

#### Initialization

This contract inherits from `OVMClient` and `OwnableUpgradeable`. In the ``initialize`` method, it initializes the smart contract with the specification of the task to be executed. For more details, refer to the [OVM Contract Specification](./specification).

Additionally, `admin` address is defined to later collect royalty fees escrowed in the contract.

```solidity
contract Pi is OVMClient, OwnableUpgradeable {
    // ...
    function initialize(address admin) external initializer {
        __Ownable_init(admin);

        // set specification
        Specification memory spec;
        spec.name = "ovm-cal-pi";
        spec.version = "1.0.0";
        spec.description = "Calculate PI";
        spec.repository = "https://github.com/webisopen/ovm-pi";
        spec.repoTag = "9231c80a6cba45c8ff9a1d3ba19e8596407e8850";
        spec.license = "WTFPL";
        spec.requirement = Requirement({
            ram: "256mb",
            disk: "5mb",
            timeout: 600,
            cpu: 1,
            gpu: 0,
            gpuModel: GPUModel.T4
        });
        spec.apiABIs =
            '[{"request": {"type":"function","name":"sendRequest","inputs":[{"name":"numDigits","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"requestId","type":"bytes32","internalType":"bytes32"}],"stateMutability":"payable"},"getResponse":{"type":"function","name":"getResponse","inputs":[{"name":"requestId","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"}}]';
        spec.royalty = 5;
        spec.execMode = ExecMode.JIT;
        spec.arch = Arch.AMD64;

        _updateSpecification(spec);
    }
    // ...
}
```

#### Send Request

Here is an example of how to send a request to calculate the value of PI with a given number of digits:

```solidity
    /**
     * @dev Sends a request to calculate the value of PI with a specified number of digits.
     * @param numDigits The number of digits to calculate for PI.
     * @return requestId The ID of the request returned by the OVMTasks contract.
     */
    function sendRequest(
        uint256 numDigits
    ) external payable returns (bytes32 requestId) {
        // encode the data
        bytes memory data = abi.encode(numDigits);
        requestId = _sendRequest(
            msg.sender,
            msg.value,
            REQ_DETERMINISTIC,
            data
        );
    }
```

This function sends a request to the OVM gateway contract, which then allocates the optimal executor to execute the task.

You can define a function with any params, just remember to encode all these params to a `bytes` type.

#### Set Response

The interface `function setResponse(bytes32 requestId, bytes calldata data)` must be implemented in order to receive the returned response of task execution.

```solidity
    /**
     * @dev Sets the response data for a specific request. This function is called by the OVMTasks
     * contract.
     * @param requestId The ID of the request.
     * @param data The response data to be set.
     */
    function setResponse(
        bytes32 requestId,
        bytes calldata data
    ) external override recordResponse(requestId) {
        // parse and save the data fulfilled by the OVMTasks contract
        (bool success, string memory strPI) = _parseData(data);
        if (success) {
            _responseData[requestId] = strPI;
        }

        emit ResponseParsed(requestId, success, strPI);
    }
```

Similarly, you need to decode the response here.

#### Collect Royalty

Royalty fees are escrowed in the contract, so we need to implement a function to collect the fees.
```solidity
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
```

## Conclusion

In this guide, we demonstrated how to publish an OVM task by building a smart contract that specifies the computation to be executed, the environment in which it should run, and the requirements for the execution.

You can now develop your smart contract with OVM to access high-performance compute resources for complex computations, AI training, and scientific simulations.
