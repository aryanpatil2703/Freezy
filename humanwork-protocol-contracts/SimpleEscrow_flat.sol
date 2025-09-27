// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// src/interfaces/IUserRegistry.sol
// File Path: src/interfaces/IUserRegistry.sol

interface IUserRegistry {
    function isRegistered(address user) external view returns (bool);
    function updateReputation(address user, uint256 newReputation) external;
}

// src/SimpleEscrow.sol
// File Path: src/SimpleEscrow.sol

contract SimpleEscrow {
    IUserRegistry public userRegistry;

    enum ProjectStatus { Active, Submitted, Completed, Disputed }

    struct Project {
        address client;
        address freelancer;
        uint256 amount;
        string descriptionCID;
        string deliverableCID;
        ProjectStatus status;
        uint256 createdAt;
        uint256 deadline;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(uint256 indexed projectId, address indexed client, address indexed freelancer, uint256 amount);
    event WorkSubmitted(uint256 indexed projectId, string deliverableCID);
    event ProjectCompleted(uint256 indexed projectId, address freelancer, uint256 amount);

    modifier onlyClient(uint256 _projectId) {
        require(projects[_projectId].client == msg.sender, "Only the client can perform this action.");
        _;
    }

    modifier onlyFreelancer(uint256 _projectId) {
        require(projects[_projectId].freelancer == msg.sender, "Only the freelancer can perform this action.");
        _;
    }

    constructor(address _userRegistryAddress) {
        userRegistry = IUserRegistry(_userRegistryAddress);
    }

    function createProject(
        address _freelancer,
        string memory _descriptionCID,
        uint256 _deadline
    ) external payable returns (uint256) {
        require(msg.value > 0, "Project must be funded.");
        require(userRegistry.isRegistered(msg.sender), "Client is not a registered user.");
        require(userRegistry.isRegistered(_freelancer), "Freelancer is not a registered user.");
        require(_deadline > block.timestamp, "Deadline must be in the future.");

        projectCount++;
        uint256 newProjectId = projectCount;

        projects[newProjectId] = Project({
            client: msg.sender,
            freelancer: _freelancer,
            amount: msg.value,
            descriptionCID: _descriptionCID,
            deliverableCID: "",
            status: ProjectStatus.Active,
            createdAt: block.timestamp,
            deadline: _deadline
        });

        emit ProjectCreated(newProjectId, msg.sender, _freelancer, msg.value);
        return newProjectId;
    }

    function submitWork(uint256 _projectId, string memory _deliverableCID) external onlyFreelancer(_projectId) {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Project is not active.");
        require(block.timestamp <= project.deadline, "The deadline has passed.");

        project.deliverableCID = _deliverableCID;
        project.status = ProjectStatus.Submitted;
        emit WorkSubmitted(_projectId, _deliverableCID);
    }

    function approveWork(uint256 _projectId) external onlyClient(_projectId) {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Submitted, "Work has not been submitted for approval.");

        project.status = ProjectStatus.Completed;
        userRegistry.updateReputation(project.freelancer, 110); 
        (bool success, ) = payable(project.freelancer).call{value: project.amount}("");
        require(success, "Failed to transfer funds to the freelancer.");

        emit ProjectCompleted(_projectId, project.freelancer, project.amount);
    }
}

