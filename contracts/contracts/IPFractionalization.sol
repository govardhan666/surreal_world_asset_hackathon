// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IPFractionalization
 * @dev Enables fractional ownership of IP assets
 */
contract IPFractionalization is Ownable, ReentrancyGuard {
    struct FractionalIP {
        uint256 ipId;
        address tokenAddress;
        uint256 totalShares;
        uint256 pricePerShare;
        address creator;
        bool isActive;
    }

    // Mapping from fractionalization ID to FractionalIP
    mapping(uint256 => FractionalIP) public fractionalIPs;

    // Mapping from IP ID to fractionalization ID
    mapping(uint256 => uint256) public ipToFractionId;

    // Counter for fractionalization IDs
    uint256 private _fractionIdCounter;

    // Events
    event IPFractionalized(
        uint256 indexed fractionId,
        uint256 indexed ipId,
        address tokenAddress,
        uint256 totalShares,
        uint256 pricePerShare
    );

    event SharesPurchased(
        uint256 indexed fractionId,
        address indexed buyer,
        uint256 shares,
        uint256 totalPrice
    );

    event RoyaltyDistributed(
        uint256 indexed fractionId,
        uint256 amount,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {
        _fractionIdCounter = 1;
    }

    /**
     * @dev Fractionalize an IP asset
     */
    function fractionalizeIP(
        uint256 ipId,
        uint256 totalShares,
        uint256 pricePerShare,
        string memory tokenName,
        string memory tokenSymbol
    ) external nonReentrant returns (uint256) {
        require(totalShares > 0, "Invalid total shares");
        require(pricePerShare > 0, "Invalid price per share");
        require(ipToFractionId[ipId] == 0, "IP already fractionalized");

        uint256 fractionId = _fractionIdCounter++;

        // Deploy ERC20 token for shares
        IPShareToken shareToken = new IPShareToken(
            tokenName,
            tokenSymbol,
            totalShares,
            msg.sender
        );

        FractionalIP memory newFraction = FractionalIP({
            ipId: ipId,
            tokenAddress: address(shareToken),
            totalShares: totalShares,
            pricePerShare: pricePerShare,
            creator: msg.sender,
            isActive: true
        });

        fractionalIPs[fractionId] = newFraction;
        ipToFractionId[ipId] = fractionId;

        emit IPFractionalized(
            fractionId,
            ipId,
            address(shareToken),
            totalShares,
            pricePerShare
        );

        return fractionId;
    }

    /**
     * @dev Purchase shares of a fractionalized IP
     */
    function purchaseShares(
        uint256 fractionId,
        uint256 shares
    ) external payable nonReentrant {
        FractionalIP storage fraction = fractionalIPs[fractionId];
        require(fraction.isActive, "Fractionalization not active");
        require(shares > 0, "Invalid shares");

        uint256 totalPrice = shares * fraction.pricePerShare;
        require(msg.value >= totalPrice, "Insufficient payment");

        // Transfer shares
        IPShareToken shareToken = IPShareToken(fraction.tokenAddress);
        require(
            shareToken.transfer(msg.sender, shares),
            "Share transfer failed"
        );

        // Transfer payment to creator
        (bool success, ) = fraction.creator.call{value: totalPrice}("");
        require(success, "Payment transfer failed");

        // Refund excess payment
        if (msg.value > totalPrice) {
            (bool refundSuccess, ) = msg.sender.call{
                value: msg.value - totalPrice
            }("");
            require(refundSuccess, "Refund failed");
        }

        emit SharesPurchased(fractionId, msg.sender, shares, totalPrice);
    }

    /**
     * @dev Distribute royalties to shareholders
     */
    function distributeRoyalties(
        uint256 fractionId
    ) external payable nonReentrant {
        FractionalIP storage fraction = fractionalIPs[fractionId];
        require(fraction.isActive, "Fractionalization not active");
        require(msg.value > 0, "No royalties to distribute");

        // In a real implementation, this would distribute proportionally to all shareholders
        // For now, we just emit an event
        emit RoyaltyDistributed(fractionId, msg.value, block.timestamp);
    }

    /**
     * @dev Get fractionalization details
     */
    function getFractionalization(
        uint256 fractionId
    ) external view returns (FractionalIP memory) {
        return fractionalIPs[fractionId];
    }
}

/**
 * @title IPShareToken
 * @dev ERC20 token representing fractional ownership
 */
contract IPShareToken is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address owner
    ) ERC20(name, symbol) {
        _mint(owner, totalSupply);
    }
}
