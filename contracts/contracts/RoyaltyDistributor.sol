// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RoyaltyDistributor
 * @dev Manages automatic royalty distribution for IP assets
 * @notice Handles licensing fees, violation settlements, and revenue sharing
 */
contract RoyaltyDistributor is Ownable, ReentrancyGuard {
    struct IPAsset {
        address owner;
        uint256 totalRevenue;
        uint256 claimedRevenue;
        uint256 royaltyPercentage; // in basis points (100 = 1%)
        bool isActive;
        mapping(address => uint256) collaboratorShares; // basis points
        address[] collaborators;
    }

    struct LicenseAgreement {
        address licensee;
        uint256 fee;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }

    struct Violation {
        address violator;
        uint256 settlementAmount;
        uint256 detectedAt;
        bool isResolved;
        bool isPaid;
    }

    // Mappings
    mapping(string => IPAsset) private ipAssets;
    mapping(string => LicenseAgreement[]) public licenses;
    mapping(string => Violation[]) public violations;
    mapping(string => uint256) public pendingRevenue;

    // Events
    event IPAssetRegistered(
        string indexed ipId,
        address indexed owner,
        uint256 royaltyPercentage
    );

    event CollaboratorAdded(
        string indexed ipId,
        address indexed collaborator,
        uint256 sharePercentage
    );

    event RevenueReceived(
        string indexed ipId,
        uint256 amount,
        string source
    );

    event RevenueDistributed(
        string indexed ipId,
        address indexed recipient,
        uint256 amount
    );

    event LicenseCreated(
        string indexed ipId,
        address indexed licensee,
        uint256 fee
    );

    event ViolationReported(
        string indexed ipId,
        address indexed violator,
        uint256 settlementAmount
    );

    event ViolationResolved(
        string indexed ipId,
        address indexed violator,
        uint256 paidAmount
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register an IP asset for royalty management
     * @param _ipId Unique identifier for the IP asset
     * @param _royaltyPercentage Royalty percentage in basis points
     */
    function registerIPAsset(string memory _ipId, uint256 _royaltyPercentage)
        external
    {
        require(
            ipAssets[_ipId].owner == address(0),
            "IP already registered"
        );
        require(
            _royaltyPercentage <= 10000,
            "Royalty percentage cannot exceed 100%"
        );

        IPAsset storage newAsset = ipAssets[_ipId];
        newAsset.owner = msg.sender;
        newAsset.royaltyPercentage = _royaltyPercentage;
        newAsset.isActive = true;

        emit IPAssetRegistered(_ipId, msg.sender, _royaltyPercentage);
    }

    /**
     * @dev Add a collaborator to an IP asset
     * @param _ipId ID of the IP asset
     * @param _collaborator Address of the collaborator
     * @param _sharePercentage Share percentage in basis points
     */
    function addCollaborator(
        string memory _ipId,
        address _collaborator,
        uint256 _sharePercentage
    ) external {
        IPAsset storage asset = ipAssets[_ipId];
        require(asset.owner == msg.sender, "Not the IP owner");
        require(_collaborator != address(0), "Invalid collaborator address");
        require(_sharePercentage > 0 && _sharePercentage <= 10000, "Invalid share percentage");

        // Calculate total shares
        uint256 totalShares = _sharePercentage;
        for (uint256 i = 0; i < asset.collaborators.length; i++) {
            totalShares += asset.collaboratorShares[asset.collaborators[i]];
        }
        require(totalShares <= 10000, "Total shares exceed 100%");

        asset.collaboratorShares[_collaborator] = _sharePercentage;
        asset.collaborators.push(_collaborator);

        emit CollaboratorAdded(_ipId, _collaborator, _sharePercentage);
    }

    /**
     * @dev Create a license agreement
     * @param _ipId ID of the IP asset
     * @param _licensee Address of the licensee
     * @param _fee License fee
     * @param _duration Duration in seconds
     */
    function createLicense(
        string memory _ipId,
        address _licensee,
        uint256 _fee,
        uint256 _duration
    ) external payable {
        IPAsset storage asset = ipAssets[_ipId];
        require(asset.isActive, "IP asset not active");
        require(msg.value >= _fee, "Insufficient payment");

        LicenseAgreement memory newLicense = LicenseAgreement({
            licensee: _licensee,
            fee: _fee,
            startDate: block.timestamp,
            endDate: block.timestamp + _duration,
            isActive: true
        });

        licenses[_ipId].push(newLicense);
        pendingRevenue[_ipId] += _fee;

        emit LicenseCreated(_ipId, _licensee, _fee);
        emit RevenueReceived(_ipId, _fee, "license");

        // Refund excess payment
        if (msg.value > _fee) {
            (bool success, ) = msg.sender.call{value: msg.value - _fee}("");
            require(success, "Refund failed");
        }
    }

    /**
     * @dev Report a violation
     * @param _ipId ID of the IP asset
     * @param _violator Address of the violator
     * @param _settlementAmount Requested settlement amount
     */
    function reportViolation(
        string memory _ipId,
        address _violator,
        uint256 _settlementAmount
    ) external {
        IPAsset storage asset = ipAssets[_ipId];
        require(asset.owner == msg.sender, "Not the IP owner");

        Violation memory newViolation = Violation({
            violator: _violator,
            settlementAmount: _settlementAmount,
            detectedAt: block.timestamp,
            isResolved: false,
            isPaid: false
        });

        violations[_ipId].push(newViolation);

        emit ViolationReported(_ipId, _violator, _settlementAmount);
    }

    /**
     * @dev Settle a violation
     * @param _ipId ID of the IP asset
     * @param _violationIndex Index of the violation
     */
    function settleViolation(string memory _ipId, uint256 _violationIndex)
        external
        payable
        nonReentrant
    {
        Violation storage violation = violations[_ipId][_violationIndex];
        require(!violation.isPaid, "Violation already paid");
        require(msg.value >= violation.settlementAmount, "Insufficient payment");

        violation.isResolved = true;
        violation.isPaid = true;

        pendingRevenue[_ipId] += violation.settlementAmount;

        emit ViolationResolved(_ipId, violation.violator, violation.settlementAmount);
        emit RevenueReceived(_ipId, violation.settlementAmount, "violation_settlement");

        // Refund excess payment
        if (msg.value > violation.settlementAmount) {
            (bool success, ) = msg.sender.call{value: msg.value - violation.settlementAmount}("");
            require(success, "Refund failed");
        }
    }

    /**
     * @dev Distribute revenue to owner and collaborators
     * @param _ipId ID of the IP asset
     */
    function distributeRevenue(string memory _ipId) external nonReentrant {
        IPAsset storage asset = ipAssets[_ipId];
        require(asset.owner == msg.sender, "Not the IP owner");

        uint256 amount = pendingRevenue[_ipId];
        require(amount > 0, "No pending revenue");

        pendingRevenue[_ipId] = 0;
        asset.totalRevenue += amount;

        // Calculate owner's share (100% - collaborators' shares)
        uint256 ownerShare = 10000;
        for (uint256 i = 0; i < asset.collaborators.length; i++) {
            address collaborator = asset.collaborators[i];
            uint256 share = asset.collaboratorShares[collaborator];
            ownerShare -= share;

            // Distribute to collaborator
            uint256 collaboratorAmount = (amount * share) / 10000;
            (bool success, ) = collaborator.call{value: collaboratorAmount}("");
            require(success, "Collaborator payment failed");

            emit RevenueDistributed(_ipId, collaborator, collaboratorAmount);
        }

        // Distribute to owner
        uint256 ownerAmount = (amount * ownerShare) / 10000;
        (bool success, ) = asset.owner.call{value: ownerAmount}("");
        require(success, "Owner payment failed");

        asset.claimedRevenue += ownerAmount;

        emit RevenueDistributed(_ipId, asset.owner, ownerAmount);
    }

    /**
     * @dev Receive royalty payments
     * @param _ipId ID of the IP asset
     */
    function receiveRoyalty(string memory _ipId) external payable {
        require(msg.value > 0, "Must send value");
        pendingRevenue[_ipId] += msg.value;

        emit RevenueReceived(_ipId, msg.value, "royalty");
    }

    /**
     * @dev Get IP asset information
     * @param _ipId ID of the IP asset
     */
    function getIPAssetInfo(string memory _ipId)
        external
        view
        returns (
            address owner,
            uint256 totalRevenue,
            uint256 claimedRevenue,
            uint256 royaltyPercentage,
            bool isActive,
            uint256 pending
        )
    {
        IPAsset storage asset = ipAssets[_ipId];
        return (
            asset.owner,
            asset.totalRevenue,
            asset.claimedRevenue,
            asset.royaltyPercentage,
            asset.isActive,
            pendingRevenue[_ipId]
        );
    }

    /**
     * @dev Get collaborators for an IP asset
     * @param _ipId ID of the IP asset
     */
    function getCollaborators(string memory _ipId)
        external
        view
        returns (address[] memory, uint256[] memory)
    {
        IPAsset storage asset = ipAssets[_ipId];
        uint256[] memory shares = new uint256[](asset.collaborators.length);

        for (uint256 i = 0; i < asset.collaborators.length; i++) {
            shares[i] = asset.collaboratorShares[asset.collaborators[i]];
        }

        return (asset.collaborators, shares);
    }

    /**
     * @dev Get violations for an IP asset
     * @param _ipId ID of the IP asset
     */
    function getViolations(string memory _ipId)
        external
        view
        returns (Violation[] memory)
    {
        return violations[_ipId];
    }

    /**
     * @dev Get licenses for an IP asset
     * @param _ipId ID of the IP asset
     */
    function getLicenses(string memory _ipId)
        external
        view
        returns (LicenseAgreement[] memory)
    {
        return licenses[_ipId];
    }

    receive() external payable {}
}
