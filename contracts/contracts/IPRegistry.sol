// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IPRegistry
 * @dev Registry for intellectual property assets
 */
contract IPRegistry is Ownable, ReentrancyGuard {
    struct IPAsset {
        address owner;
        string contentHash;
        string metadataURI;
        uint256 registeredAt;
        bool isActive;
    }

    // Mapping from IP ID to IP Asset
    mapping(uint256 => IPAsset) public ipAssets;

    // Mapping from content hash to IP ID
    mapping(string => uint256) public contentHashToIPId;

    // Mapping from owner to their IP IDs
    mapping(address => uint256[]) public ownerToIPIds;

    // Counter for IP IDs
    uint256 private _ipIdCounter;

    // Events
    event IPRegistered(
        uint256 indexed ipId,
        address indexed owner,
        string contentHash,
        string metadataURI
    );

    event IPTransferred(
        uint256 indexed ipId,
        address indexed from,
        address indexed to
    );

    event IPDeactivated(uint256 indexed ipId);

    constructor() Ownable(msg.sender) {
        _ipIdCounter = 1;
    }

    /**
     * @dev Register a new IP asset
     */
    function registerIP(
        string memory contentHash,
        string memory metadataURI
    ) external nonReentrant returns (uint256) {
        require(bytes(contentHash).length > 0, "Content hash required");
        require(
            contentHashToIPId[contentHash] == 0,
            "IP already registered"
        );

        uint256 ipId = _ipIdCounter++;

        IPAsset memory newIP = IPAsset({
            owner: msg.sender,
            contentHash: contentHash,
            metadataURI: metadataURI,
            registeredAt: block.timestamp,
            isActive: true
        });

        ipAssets[ipId] = newIP;
        contentHashToIPId[contentHash] = ipId;
        ownerToIPIds[msg.sender].push(ipId);

        emit IPRegistered(ipId, msg.sender, contentHash, metadataURI);

        return ipId;
    }

    /**
     * @dev Transfer IP ownership
     */
    function transferIP(
        uint256 ipId,
        address to
    ) external nonReentrant {
        IPAsset storage ip = ipAssets[ipId];
        require(ip.owner == msg.sender, "Not the owner");
        require(to != address(0), "Invalid address");
        require(ip.isActive, "IP not active");

        address from = ip.owner;
        ip.owner = to;

        // Update owner mappings
        ownerToIPIds[to].push(ipId);

        emit IPTransferred(ipId, from, to);
    }

    /**
     * @dev Deactivate an IP asset
     */
    function deactivateIP(uint256 ipId) external {
        IPAsset storage ip = ipAssets[ipId];
        require(ip.owner == msg.sender, "Not the owner");
        require(ip.isActive, "Already deactivated");

        ip.isActive = false;

        emit IPDeactivated(ipId);
    }

    /**
     * @dev Get IP asset details
     */
    function getIPAsset(
        uint256 ipId
    ) external view returns (IPAsset memory) {
        return ipAssets[ipId];
    }

    /**
     * @dev Get IPs owned by an address
     */
    function getOwnerIPs(
        address owner
    ) external view returns (uint256[] memory) {
        return ownerToIPIds[owner];
    }

    /**
     * @dev Check if content hash is registered
     */
    function isContentRegistered(
        string memory contentHash
    ) external view returns (bool) {
        return contentHashToIPId[contentHash] != 0;
    }

    /**
     * @dev Get IP ID by content hash
     */
    function getIPIdByContentHash(
        string memory contentHash
    ) external view returns (uint256) {
        return contentHashToIPId[contentHash];
    }
}
