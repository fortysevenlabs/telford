//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TelfordSource {
    // this contract will be deployed to Arbitrum
    address private userAddress;
    address private bonderAddress;
    address private l1Relayer;
    uint256 constant bonderFee = 0.2 ether;
    uint256 private bonderPayment;

    event BridgeRequested(uint256 indexed amount);
    event TransferRequestBonded(address indexed userAddress);
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
            msg.sender == bonderAddress,
            "Sorry pal, I can only be called by the Bonder!"
        );
        _;
    }

    constructor(address _bonderAddress, address _l1RelayerAddress) {
        bonderAddress = _bonderAddress;
        l1Relayer = _l1RelayerAddress;
    }

    function bridge(uint256 _amount) external {
        userAddress = msg.sender;
        bonderPayment = _amount + bonderFee;
        //
        // To Do. Access the WETH contract, and approve this contract address to transfer bonderPayment from userAddress.
        //
        emit BridgeRequested(_amount);
    }

    function bond() external onlyBonder {
        //
        // To Do. logic to transfer the bonderPayment from the userAddress to this contract address.
        //
        emit TransferRequestBonded(userAddress);
    }

    function fundsReceivedOnDestination() external onlyL1Relayer {
        //
        // To Do. logic to transfer the bonderPayment from this contract address to the bonderAddress.
        //
        emit BonderReimbursed(bonderPayment);
    }
}
