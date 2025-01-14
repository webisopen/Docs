---
title: Calculate π
description: Use OVM to approximate the value of π.
---

## Introduction

π, a mathematical constant, represents the ratio of a circle’s circumference to its diameter and is approximately equal to 3.14159.
As an irrational number, π cannot be expressed precisely as a ratio of two integers. Its decimal expansion is infinite and non-repeating, with no discernible pattern.
Its approximation is therefore a common challenge in computer science and mathematics, with many algorithms developed to calculate π to a high degree of precision.

OVM can be used to execute complex computations like AI training, scientific simulations, or any other compute-intensive tasks that are not feasible on an EVM blockchain.
This includes calculating the value of π to a high degree of precision.

In this tutorial, you will learn how to write an OVM task to calculate the value of π.

## Getting Started

Rest assured, this is not a math class, but a practical exercise to demonstrate the power of OVM.

### Prerequisites

Before you start building, make sure you have the following prerequisites:

1. Installed [Python 3](https://www.python.org/downloads/)
1. Installed [Poetry](https://python-poetry.org/docs/#installation)
1. Installed [Foundry](https://getfoundry.sh/)

### Installation

You should use Poetry to create a Python project.
Poetry will generate a `pyproject.toml` file that includes the project dependencies.
We use Poetry to manage the dependencies and virtual environment for the project, so it will be easier to manage and containerize the project later.

```bash
    poetry new ovm-pi && cd ovm-pi
```

We then use OVM Python SDK to interact with OVM Gateway to access verifiable and high-performance compute resources.

```bash
    poetry add git+ssh://git@github.com/webisopen/ovm-python.git@main
```

### Python Code

Let's start by creating a new Python file, `main.py`, and writing the following code:

```python
    from mpmath import mp
    import sys

    import eth_abi
    from ovm import Bridge

    def calculate_pi(precision: int) -> str:
        """
        Approximates π using mpmath.

        Args:
            precision (int): The number of decimal places to compute π.

        Returns:
            str: The string representation of the approximated π value.
        """
        if precision > 100:
            raise ValueError("precision must be less than 100")

        # Set mpmath precision to 100
        mp.dps = 100

        # Return the result as a string rounded to the desired precision
        return mp.nstr(mp.pi, precision)

    if __name__ == "__main__":
        if len(sys.argv) != 2:
            raise ValueError("missing messages argument")

        (input,) = eth_abi.decode(["uint"], bytes.fromhex(sys.argv[1]))
        output = [True, calculate_pi(input)]

        bridge.submit(["bool", "string"], output)
```

The `calculate_pi` function returns π using mpmath.
You may also implement your own code (Chudnovsky or others) to approximate π, but for this tutorial, we will use mpmath for simplicity.

We also set the precision to 100 decimal places, which is more than enough for most applications.
Anything beyond 100 decimal places is considered an overkill, so we will raise an error when the input is greater than 100.

The rest of the code uses eth_abi to decode the input from hexidecimal to an integer, calculates π, and submits the result to the OVM Gateway.

### Dockerfile

We containerize the Python code using Docker.
This is to ensure that the code runs in a consistent environment and can be easily sprung up by any OVM Executor.

```Dockerfile
    FROM python:3.13.0

    WORKDIR /root

    RUN pip install poetry

    COPY poetry.lock pyproject.toml ./

    RUN poetry install --only main

    COPY . .

    ENTRYPOINT ["poetry", "run", "ovm_pi"]
```

### Smart Contract

#### Init a New Project

We now write a Solidity contract to enable others to interact with the code above, and making sure all interactions are recorded on-chain.

```bash
    mkdir ovm-pi-contract && cd ovm-pi-contract
    forge init
```

#### Add Dependencies

All OVM contracts depend on the [OVM contracts library](https://github.com/webisopen/ovm-contracts).
We can install the library using Forge and update the remappings to point to the source code.

```bash
    forge install https://github.com/webisopen/ovm-contracts
    forge remappings > remappings.txt
    sed -i -e "s/ovm-contracts\/=lib\/ovm-contracts\//@webisopen\/ovm-contracts\/=lib\/ovm-contracts\/src\//g" remappings.txt
```

#### Implement Pi.sol

We begin by creating a new `Pi.sol` in `src` folder.
Common features are implemented in the `OVMClient` contract, which can be imported and ready to use.

```solidity
    // SPDX-License-Identifier: UNLICENSED
    pragma solidity ^0.8.13;

    import {OVMClient} from "@webisopen/ovm-contracts/OVMClient.sol";
    import {GPUModel, Requirement, Specification} from "@webisopen/ovm-contracts/libraries/DataTypes.sol";

    contract Pi is OVMClient {
        mapping(bytes32 requestId => string result) internal _results;

        constructor(address ovmTaskAddress, address admin) OVMClient(ovmTaskAddress, admin) {
            Requirement memory requirement =
                Requirement({ram: "128mb", disk: "100mb", timeout: 1000, cpu: 1, gpu: 0, gpuModel: GPUModel.T4});

            Specification memory specification;
            specification.name = "ovm-pi";
            specification.version = "0.1.0";
            specification.repository = "https://github.com/webisopen/ovm-pi";
            specification.requirement = requirement;

            _updateSpecification(specification);
        }

        function setResponse(bytes32 requestId, bytes calldata data)
            external
            override
            recordResponse(requestId)
            onlyOVMTask
        {
            (bool success, string memory result) = abi.decode(data, (bool, string));
            if (success) {
                _results[requestId] = result;
            }
        }

        function sendRequest(uint256 decimal) external payable returns (bytes32 requestId) {
            bytes memory data = abi.encode(decimal);

            requestId = _sendRequest(msg.sender, msg.value, true, data);
        }
    }
```

In this contract:

- `constructor` initializes the task with the required specifications. **Update `specification.repository` to point to your git repository.**
- `sendRequest` is used to monitor user requests and forward them to the OVM Gateway.
- `setResponse` is used to receive the response from the OVM Gateway, decode the response, and store the result.

All results are recorded on-chain, ensuring transparency and verifiability.

#### Contract Deployment

Once the development is done, we deploy the contract to Open Chain Testnet using Forge.

```bash
    forge create src/Pi.sol:Pi \
        --rpc-url https://rpc.testnet.open.network \
        --private-key 0x0 \
        --constructor-args 0xbb2F7085Ad69653B8574121A549e247B24C64f25 0x0
```

Use your own private key with sufficient funds to deploy the contract.

`0xbb2F7085Ad69653B8574121A549e247B24C64f25` is the OVM Gateway contract.

Upon deployment, the contract will be registered with the OVM Gateway, and users can start sending requests to calculate π.

#### Testing

Before testing your contract, make sure you have committed and pushed your code to a remote git repository.

```bash
    git add .
    git commit -m "feat: add pi contract"
    git push
```

We can now test the contract by sending a request to calculate π.

```bash
    cast send \
    0xcontract "sendRequest(uint decimal)" 2 \
    --rpc-url https://rpc.testnet.open.network \
    --private-key 0x0
```

Replace `0xcontract` with the contract address that you just deployed.
And supply your private key to sign the transaction.

The calculation will be distributed to any available OVM Executor, the Executor will then pull the code from your git repository, execute the code, and submit the result on-chain via `setResponse`.

## Conclusion

Congratulations! You have successfully written an OVM task to calculate the value of π.
This tutorial demonstrates the power of OVM in executing complex computations and recording the results on-chain for transparency and verifiability.

You can now develop your smart contract with OVM to access high-performance compute resources for other complex computations such as AI training and scientific simulations.
