// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract L2BridgeDest {
    address owner;
    address contractAddress;
    address bonderAddress;

    // ERC20 private _ethToken;

    constructor(address _bonderAddress) {
        owner = msg.sender;
        contractAddress = address(this);
        bonderAddress = _bonderAddress;
        // _ethToken = ERC20(_tokenContractAddress);
    }

    /** modifiers */
    modifier _ownerOnly() {
        require(msg.sender == owner, "Only owners can perform this operation!");
        _;
    }

    modifier _bonderOnly() {
        require(msg.sender == bonderAddress, "You must be a bonder to initiate withdrawAndDistribute!");
        _;
    }

    /** events */
    event TransferFromBonderCompleted(uint256 transferId, address bonder, uint256 amount, address contractAddress, address user);
    event TransferToUserCompleted(uint256 transferId,address contractAddress, address user, uint256 amount, address bonder);

    function depositAndDistribute(
        address _bonder,
        address _user,
        uint256 _amount,
        uint256 _transferId
    )
        external
        _bonderOnly
        payable
    {
        // _ethToken.transferFrom(_bonder, contractAddress, _amount);
        emit TransferFromBonderCompleted(_transferId, _bonder, _amount, contractAddress, _user);

        _distribute(_bonder, _user, _amount, _transferId);
    }

    function _distribute(
        address _bonder,
        address _user,
        uint256 _amount,
        uint256 _transferId
    )
        private
    {
        // _ethToken.transferFrom(contractAddress, _user, _amount);

        (bool success, ) = _user.call{value: _amount, gas: 35000}("");
        require(success, "transfer failed");

        emit TransferToUserCompleted(_transferId, contractAddress, _user, _amount, _bonder);
    }
}

// TODO
// [ ] Bonder allowance process
// [ ] Do we need to manage for re-entrancy guard?
// [ ] Do we want to maintain a data structure bonder, user, chainId, transferId
// [ ] Need data structure on L1 for the x-domain-call
// [ ] Add a helper function to use the right ERC20 token for each network 
// [ ] Do we need an require(allowance > amount) check, or, does ERC20 takes care of that
// [ ] Contract optimization
// [ ] Add a transferId to the withdrawAndDistribute function

// Future Work
// - Support bonder registry (vs single bonder)
// - Support ERC20 tokens