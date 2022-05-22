//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TelfordSource {
    // this contract will be deployed to Arbitrum
    address private userSourceAddress;
    address private userDestinationAddress;
    address private bonderReimbursementAddress;
    address private bonderClient;
    address private l1Relayer;

    uint256 private requestedTransferAmount;
    uint256 private bonderPayment;

    uint256 constant bonderFee = 0.2 ether;

    event BridgeRequested(uint256 indexed amount);
    event TransferRequestBonded(address indexed userDestinationAddress);
    event BonderReimbursed(uint256 indexed bonderPayment);

    modifier onlyL1Relayer() {
        require(
            msg.sender == l1Relayer,
            "Sorry pal, I can only be called by the L1Relayer!"
        );
        _;
    }
    modifier onlyBonder() {
        require(
            msg.sender == bonderClient,
            "Sorry pal, I can only be called by the Bonder!"
        );
        _;
    }

    constructor(address _bonderClientAddress, address _l1RelayerAddress) {
        bonderClient = _bonderClientAddress;
        l1Relayer = _l1RelayerAddress;
    }

    function bridge(
        uint256 _amount,
        address _userSourceAddr,
        address _userDestinationAddr
    ) external {
        userSourceAddress = _userSourceAddr;
        userDestinationAddress = _userDestinationAddr;
        requestedTransferAmount = _amount;

        emit BridgeRequested(requestedTransferAmount);
    }

    function bond(address _reimbursementAddress) external onlyBonder {
        bonderReimbursementAddress = _reimbursementAddress;
        bonderPayment = requestedTransferAmount + bonderFee;
        //
        // To Do. logic to transfer the _bonderPayment from the _userSourceAddress on Arbitrum to the contract account.
        //
        emit TransferRequestBonded(userDestinationAddress);
    }

    function fundsReceivedOnDestination() external onlyL1Relayer {
        //
        // To Do. logic to transfer the _bonderPayment to the _bonderReimbursementAddress on Arbitrum from this contract.
        //
        emit BonderReimbursed(bonderPayment);
    }
}
