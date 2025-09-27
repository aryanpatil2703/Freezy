// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// src/SimpleEscrow.sol

// Interface to allow this contract to call a function on our UserRegistry contract.
interface IUserRegistry {
    function isRegistered(address user) external view returns (bool);
}

/**
 * @title SimpleEscrow
 * @dev Manages a single-payment escrow for projects. Payments are in native currency 
 * (ETH on World Chain, HBAR on Hedera).
 */
contract SimpleEscrow {
    IUserRegistry public userRegistry;

    enum ProjectStatus { Active, Submitted, Completed }

    struct Project {
        address client;
        address freelancer;
        uint256 amount;           // Amount of native currency held in escrow.
        string descriptionCID;    // Lighthouse IPFS hash for the project brief.
        string deliverableCID;    // Lighthouse IPFS hash for the final submitted work.
        ProjectStatus status;
        uint256 createdAt;
        uint256 deadline;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(uint256 indexed projectId, address indexed client, address indexed freelancer, uint256 amount);
    event WorkSubmitted(uint256 indexed projectId, string deliverableCID);
    event ProjectCompleted(uint256 indexed projectId, uint256 amount);

    /**
     * @param _userRegistryAddress The deployed address of the UserRegistry contract.
     */
    constructor(address _userRegistryAddress) {
        userRegistry = IUserRegistry(_userRegistryAddress);
    }

    /**
     * @notice Creates a new project and locks the full payment in the contract's escrow.
     * @dev This function is `payable`, meaning it must receive native currency when called.
     * @param _freelancer The address of the verified freelancer being hired.
     * @param _descriptionCID The Lighthouse IPFS CID of the project description.
     * @param _deadline The project deadline as a Unix timestamp.
     */
    function createProject(
        address _freelancer,
        string memory _descriptionCID,
        uint256 _deadline
    ) external payable returns (uint256) {
        // --- Checks ---
        require(msg.value > 0, "You must fund the project with ETH or HBAR.");
        require(userRegistry.isRegistered(msg.sender), "Client is not a registered user.");
        require(userRegistry.isRegistered(_freelancer), "Freelancer is not a registered user.");
        require(_deadline > block.timestamp, "Deadline cannot be in the past.");

        uint256 projectId = ++projectCount;

        // --- Effects ---
        projects[projectId] = Project({
            client: msg.sender,
            freelancer: _freelancer,
            amount: msg.value,
            descriptionCID: _descriptionCID,
            deliverableCID: "", // Empty until freelancer submits work.
            status: ProjectStatus.Active,
            createdAt: block.timestamp,
            deadline: _deadline
        });

        // --- Interactions ---
        emit ProjectCreated(projectId, msg.sender, _freelancer, msg.value);
        return projectId;
    }

    /**
     * @notice Allows the assigned freelancer to submit their final work for review.
     * @param _projectId The ID of the project they are submitting for.
     * @param _deliverableCID The Lighthouse IPFS CID of their final deliverable.
     */
    function submitWork(uint256 _projectId, string memory _deliverableCID) external {
        Project storage project = projects[_projectId];
        require(project.freelancer == msg.sender, "Only the assigned freelancer can submit work.");
        require(project.status == ProjectStatus.Active, "Project is not currently active.");
        
        project.deliverableCID = _deliverableCID;
        project.status = ProjectStatus.Submitted;
        emit WorkSubmitted(_projectId, _deliverableCID);
    }

    /**
     * @notice Allows the client to approve the submitted work and release the full payment to the freelancer.
     * @param _projectId The ID of the project to approve.
     */
    function approveWork(uint256 _projectId) external {
        Project storage project = projects[_projectId];
        require(project.client == msg.sender, "Only the client can approve work.");
        require(project.status == ProjectStatus.Submitted, "Work has not been submitted yet.");
        
        project.status = ProjectStatus.Completed;
        
        // Transfer the full escrowed amount to the freelancer's wallet.
        (bool success, ) = project.freelancer.call{value: project.amount}("");
        require(success, "Payment transfer failed.");
        
        emit ProjectCompleted(_projectId, project.amount);
    }
}

