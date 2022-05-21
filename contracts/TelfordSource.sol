//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TelfordSource {
    // this contract will be deployed to Arbitrum
    address private _userSourceAddress;
    address private _userDestinationAddress;
    address private _bonderReimbursementAddress;

    uint256 private _requestedTransferAmount;
    uint256 private _bonderPayment;

    uint256 constant bonderFee = 0.2 ether;

    event BridgeRequested(uint256 indexed amount);
    event TransferRequestBonded(address indexed _userDestinationAddress);
    event BonderReimbursed(uint256 indexed bonderPayment);

    modifier onlyL1Relayer() {
        // to do
        _;
    }
    modifier onlyBonder() {
        // to do
        _;
    }

    function bridge(
        uint256 _amount,
        address _userSourceAddr,
        address _userDestinationAddr
    ) external {
        _userSourceAddress = _userSourceAddr;
        _userDestinationAddress = _userDestinationAddr;
        _requestedTransferAmount = _amount;

        emit BridgeRequested(_requestedTransferAmount);
    }

    function bond(address _reimbursementAddress) external onlyBonder {
        _bonderReimbursementAddress = _reimbursementAddress;
        _bonderPayment = _requestedTransferAmount + bonderFee;
        //
        // To Do. logic to transfer the _bonderPayment from the _userSourceAddress on Arbitrum to the contract account.
        //
        emit TransferRequestBonded(_userDestinationAddress);
    }

    function fundsReceivedOnDestination() external onlyL1Relayer {
        //
        // To Do. logic to transfer the _bonderPayment to the _bonderReimbursementAddress on Arbitrum from this contract.
        //
        emit BonderReimbursed(_bonderPayment);
    }
}
