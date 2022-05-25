// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.13;

import "hardhat/console.sol";
import {ICrossDomainMessenger} from "@eth-optimism/contracts/libraries/bridge/ICrossDomainMessenger.sol";
import "arb-bridge-eth/contracts/bridge/Inbox.sol";
import "./TelfordSource.sol";

/**
 * @dev L1Relayer is responsible for accepting the message from the L2BridgeDest contract on Optimism
 * and sending (relaying) a message to the TelfordSource contract on Arbitrum
 */

contract L1Relayer {
    /* ========== State ========== */

    address public bonderAddress;
    address public userAddress;
    uint256 public amount;
    uint256 public transferId;
    address private owner;
    IInbox public inboxArbitrum =
        IInbox(0x578BAde599406A8fE3d24Fd7f7211c0911F5B29e); // Address of the Arbitrum Inbox on the L1 chain
    address public crossDomainMessangerOptimism =
        0x4361d0F75A0186C05f971c566dC6bEa5957483fD;
    ICrossDomainMessenger public crossDomainMessanger =
        ICrossDomainMessenger(crossDomainMessanger);

    /* ========== Constants ========== */

    address public constant TELFORD_SOURCE =
        0xD2dB8075693aA6A0D5C026cdf319D517516c1D40; // Address of Telford source on the testnet
    address public TELFORD_DESTINATION =
        crossDomainMessanger.xDomainMessageSender(); // Will update it to hardcode

    /* ========== Events ========== */

    event updatedInfo(
        address bonder,
        address user,
        uint256 amount,
        uint256 transferId
    );
    event RetryableTicketCreated(uint256 indexed ticketId);

    /* ========== Modifier / Constructor ========== */

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owners can perform this operation!");
        _;
    }

    modifier onlyTelfordDestination() {
        require(
            msg.sender == crossDomainMessangerOptimism &&
                crossDomainMessanger.xDomainMessageSender() ==
                TELFORD_DESTINATION,
            "Only the Telford Destination Contract can perform this operation!"
        );
        _;
    }

    /* ========== Receiving Function ========== */

    /**
     * @dev Function that is called on by Optimism's messagers contract via Telford's destination contract
     * @param _bonder The address of the bonder who provided liquidity for the transaction
     * @param _user The address of the user who is bridging
     * @param _amount The amount the user is bridging (sub fees for the bonder)
     * @param _transferId Number to keep track of the transfer in progress
     */

    function receiveDestinationTransferConfirmation(
        address _bonder,
        address _user,
        uint256 _amount,
        uint256 _transferId
    ) external onlyTelfordDestination {
        bonderAddress = _bonder;
        userAddress = _user;
        amount = _amount;
        transferId = _transferId;
        emit updatedInfo(_bonder, _user, _amount, _transferId);
        _relayToArbitrum(10000000000000000, 0, 0);
    }

    /* ========== Sending Function ========== */

    /**
     * @dev Function that is called on the final step of accepting the distribution from Telford's Optimism contract,
     * It's purpose is to send a Retryable Ticket which will call on Telford's Arbitrum fundsReceivedOnDestination function
     * @param maxSubmissionCost Max gas deducted from user's L2 balance to cover base submission fee
     * @param maxGas Max gas deducted from user's L2 balance to cover L2 execution
     * @param gasPriceBid price bid for L2 execution
     */

    function _relayToArbitrum(
        uint256 maxSubmissionCost,
        uint256 maxGas,
        uint256 gasPriceBid
    ) public payable returns (uint256) {
        bytes memory data = abi.encodeWithSelector(
            TelfordSource.fundsReceivedOnDestination.selector
        );
        uint256 ticketID = inboxArbitrum.createRetryableTicket{
            value: msg.value
        }(
            TELFORD_SOURCE,
            0,
            maxSubmissionCost,
            msg.sender,
            msg.sender,
            maxGas,
            gasPriceBid,
            data
        );

        emit RetryableTicketCreated(ticketID);
        return ticketID;
    }

    /* ========== Receive Fallback & Withdrawl Function ========== */

    // Functions are used so the owner can deposit / withdraw ETH for gas

    receive() external payable {}

    function withdrawEther() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
}
