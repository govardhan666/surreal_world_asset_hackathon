// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DisputeResolution
 * @dev On-chain dispute resolution for IP violations
 */
contract DisputeResolution is Ownable, ReentrancyGuard {
    enum DisputeStatus {
        Open,
        UnderReview,
        Resolved,
        Rejected
    }

    struct Dispute {
        uint256 ipId;
        address plaintiff;
        address defendant;
        string evidenceURI;
        DisputeStatus status;
        uint256 createdAt;
        uint256 resolvedAt;
        string resolution;
    }

    // Mapping from dispute ID to Dispute
    mapping(uint256 => Dispute) public disputes;

    // Mapping from IP ID to dispute IDs
    mapping(uint256 => uint256[]) public ipToDisputes;

    // Counter for dispute IDs
    uint256 private _disputeIdCounter;

    // Events
    event DisputeFiled(
        uint256 indexed disputeId,
        uint256 indexed ipId,
        address indexed plaintiff,
        address defendant
    );

    event DisputeStatusUpdated(
        uint256 indexed disputeId,
        DisputeStatus status
    );

    event DisputeResolved(
        uint256 indexed disputeId,
        string resolution
    );

    constructor() Ownable(msg.sender) {
        _disputeIdCounter = 1;
    }

    /**
     * @dev File a new dispute
     */
    function fileDispute(
        uint256 ipId,
        address defendant,
        string memory evidenceURI
    ) external nonReentrant returns (uint256) {
        require(defendant != address(0), "Invalid defendant");
        require(defendant != msg.sender, "Cannot dispute yourself");
        require(bytes(evidenceURI).length > 0, "Evidence required");

        uint256 disputeId = _disputeIdCounter++;

        Dispute memory newDispute = Dispute({
            ipId: ipId,
            plaintiff: msg.sender,
            defendant: defendant,
            evidenceURI: evidenceURI,
            status: DisputeStatus.Open,
            createdAt: block.timestamp,
            resolvedAt: 0,
            resolution: ""
        });

        disputes[disputeId] = newDispute;
        ipToDisputes[ipId].push(disputeId);

        emit DisputeFiled(disputeId, ipId, msg.sender, defendant);

        return disputeId;
    }

    /**
     * @dev Update dispute status (only owner)
     */
    function updateDisputeStatus(
        uint256 disputeId,
        DisputeStatus status
    ) external onlyOwner {
        Dispute storage dispute = disputes[disputeId];
        require(dispute.createdAt > 0, "Dispute does not exist");

        dispute.status = status;

        emit DisputeStatusUpdated(disputeId, status);
    }

    /**
     * @dev Resolve a dispute (only owner)
     */
    function resolveDispute(
        uint256 disputeId,
        string memory resolution
    ) external onlyOwner {
        Dispute storage dispute = disputes[disputeId];
        require(dispute.createdAt > 0, "Dispute does not exist");
        require(
            dispute.status != DisputeStatus.Resolved,
            "Already resolved"
        );

        dispute.status = DisputeStatus.Resolved;
        dispute.resolvedAt = block.timestamp;
        dispute.resolution = resolution;

        emit DisputeResolved(disputeId, resolution);
    }

    /**
     * @dev Get dispute details
     */
    function getDispute(
        uint256 disputeId
    ) external view returns (Dispute memory) {
        return disputes[disputeId];
    }

    /**
     * @dev Get disputes for an IP
     */
    function getIPDisputes(
        uint256 ipId
    ) external view returns (uint256[] memory) {
        return ipToDisputes[ipId];
    }

    /**
     * @dev Get disputes by plaintiff
     */
    function getPlaintiffDisputes(
        address plaintiff
    ) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](_disputeIdCounter);
        uint256 count = 0;

        for (uint256 i = 1; i < _disputeIdCounter; i++) {
            if (disputes[i].plaintiff == plaintiff) {
                result[count] = i;
                count++;
            }
        }

        // Resize array
        uint256[] memory finalResult = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }

        return finalResult;
    }
}
