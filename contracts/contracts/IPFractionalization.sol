// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IPFractionalization
 * @dev Enables fractional ownership of IP assets through ERC20 tokens
 * @notice This contract allows IP owners to fractionalize their assets and distribute ownership
 */
contract IPFractionalization is Ownable, ReentrancyGuard {
    struct FractionalizedIP {
        address ipOwner;
        address tokenAddress;
        uint256 totalShares;
        uint256 sharesIssued;
        uint256 pricePerShare;
        bool isActive;
        string ipId;
        string metadata;
    }

    struct ShareholderInfo {
        uint256 shares;
        uint256 totalDividendsReceived;
        uint256 lastClaimTimestamp;
    }

    // Mapping from IP ID to fractionalized IP data
    mapping(string => FractionalizedIP) public fractionalizedIPs;

    // Mapping from IP ID to shareholder address to their info
    mapping(string => mapping(address => ShareholderInfo)) public shareholders;

    // Array of all IP IDs
    string[] public allIPIds;

    // Events
    event IPFractionalized(
        string indexed ipId,
        address indexed owner,
        address tokenAddress,
        uint256 totalShares,
        uint256 pricePerShare
    );

    event SharesPurchased(
        string indexed ipId,
        address indexed buyer,
        uint256 shares,
        uint256 amount
    );

    event SharesTransferred(
        string indexed ipId,
        address indexed from,
        address indexed to,
        uint256 shares
    );

    event DividendsDistributed(
        string indexed ipId,
        uint256 amount,
        uint256 timestamp
    );

    event DividendsClaimed(
        string indexed ipId,
        address indexed shareholder,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Fractionalize an IP asset into ERC20 tokens
     * @param _ipId Unique identifier for the IP asset
     * @param _totalShares Total number of shares to create
     * @param _pricePerShare Price per share in wei
     * @param _metadata IPFS hash or metadata URI
     */
    function fractionalizeIP(
        string memory _ipId,
        uint256 _totalShares,
        uint256 _pricePerShare,
        string memory _metadata
    ) external {
        require(_totalShares > 0, "Total shares must be greater than 0");
        require(_pricePerShare > 0, "Price per share must be greater than 0");
        require(
            fractionalizedIPs[_ipId].ipOwner == address(0),
            "IP already fractionalized"
        );

        // Create ERC20 token for this IP
        IPShareToken shareToken = new IPShareToken(
            string(abi.encodePacked("IP Share: ", _ipId)),
            string(abi.encodePacked("IPS-", _ipId)),
            _totalShares
        );

        // Store fractionalized IP data
        fractionalizedIPs[_ipId] = FractionalizedIP({
            ipOwner: msg.sender,
            tokenAddress: address(shareToken),
            totalShares: _totalShares,
            sharesIssued: 0,
            pricePerShare: _pricePerShare,
            isActive: true,
            ipId: _ipId,
            metadata: _metadata
        });

        allIPIds.push(_ipId);

        emit IPFractionalized(
            _ipId,
            msg.sender,
            address(shareToken),
            _totalShares,
            _pricePerShare
        );
    }

    /**
     * @dev Purchase shares of a fractionalized IP
     * @param _ipId ID of the IP asset
     * @param _shares Number of shares to purchase
     */
    function purchaseShares(string memory _ipId, uint256 _shares)
        external
        payable
        nonReentrant
    {
        FractionalizedIP storage ip = fractionalizedIPs[_ipId];
        require(ip.isActive, "IP not active");
        require(
            ip.sharesIssued + _shares <= ip.totalShares,
            "Not enough shares available"
        );

        uint256 totalCost = _shares * ip.pricePerShare;
        require(msg.value >= totalCost, "Insufficient payment");

        // Update shareholder info
        shareholders[_ipId][msg.sender].shares += _shares;
        ip.sharesIssued += _shares;

        // Transfer tokens to buyer
        IPShareToken token = IPShareToken(ip.tokenAddress);
        token.transfer(msg.sender, _shares);

        // Transfer funds to IP owner
        (bool success, ) = ip.ipOwner.call{value: totalCost}("");
        require(success, "Transfer failed");

        // Refund excess payment
        if (msg.value > totalCost) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - totalCost}("");
            require(refundSuccess, "Refund failed");
        }

        emit SharesPurchased(_ipId, msg.sender, _shares, totalCost);
    }

    /**
     * @dev Distribute dividends to all shareholders
     * @param _ipId ID of the IP asset
     */
    function distributeDividends(string memory _ipId) external payable {
        FractionalizedIP storage ip = fractionalizedIPs[_ipId];
        require(ip.isActive, "IP not active");
        require(msg.value > 0, "Must send dividends");

        emit DividendsDistributed(_ipId, msg.value, block.timestamp);
    }

    /**
     * @dev Claim dividends for a shareholder
     * @param _ipId ID of the IP asset
     */
    function claimDividends(string memory _ipId) external nonReentrant {
        FractionalizedIP storage ip = fractionalizedIPs[_ipId];
        ShareholderInfo storage shareholderInfo = shareholders[_ipId][msg.sender];

        require(shareholderInfo.shares > 0, "No shares owned");

        // Calculate dividends based on share percentage
        uint256 dividends = calculateDividends(_ipId, msg.sender);
        require(dividends > 0, "No dividends available");

        shareholderInfo.totalDividendsReceived += dividends;
        shareholderInfo.lastClaimTimestamp = block.timestamp;

        (bool success, ) = msg.sender.call{value: dividends}("");
        require(success, "Dividend transfer failed");

        emit DividendsClaimed(_ipId, msg.sender, dividends);
    }

    /**
     * @dev Calculate dividends for a shareholder
     * @param _ipId ID of the IP asset
     * @param _shareholder Address of the shareholder
     */
    function calculateDividends(string memory _ipId, address _shareholder)
        public
        view
        returns (uint256)
    {
        FractionalizedIP storage ip = fractionalizedIPs[_ipId];
        ShareholderInfo storage shareholderInfo = shareholders[_ipId][_shareholder];

        if (shareholderInfo.shares == 0 || ip.sharesIssued == 0) {
            return 0;
        }

        uint256 contractBalance = address(this).balance;
        uint256 sharePercentage = (shareholderInfo.shares * 1e18) / ip.sharesIssued;
        uint256 dividends = (contractBalance * sharePercentage) / 1e18;

        return dividends;
    }

    /**
     * @dev Get shareholder information
     * @param _ipId ID of the IP asset
     * @param _shareholder Address of the shareholder
     */
    function getShareholderInfo(string memory _ipId, address _shareholder)
        external
        view
        returns (ShareholderInfo memory)
    {
        return shareholders[_ipId][_shareholder];
    }

    /**
     * @dev Get fractionalized IP information
     * @param _ipId ID of the IP asset
     */
    function getIPInfo(string memory _ipId)
        external
        view
        returns (FractionalizedIP memory)
    {
        return fractionalizedIPs[_ipId];
    }

    /**
     * @dev Get all IP IDs
     */
    function getAllIPIds() external view returns (string[] memory) {
        return allIPIds;
    }

    receive() external payable {}
}

/**
 * @title IPShareToken
 * @dev ERC20 token representing fractional ownership of an IP asset
 */
contract IPShareToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, totalSupply);
    }

    function transfer(address to, uint256 amount)
        public
        override
        onlyOwner
        returns (bool)
    {
        _transfer(owner(), to, amount);
        return true;
    }
}
