// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IUserRegistry {
    // Define the User struct so this contract knows what to expect
    struct User {
        address wallet;
        string profileCID;
        string credentialsCID;
        string githubProofCID;
        bool isVerified;
        bool isFreelancer;
        uint256 reputation;
        uint256 registrationTime;
        uint256 completedProjects;
        uint256 chainId;
    }

    function getUser(address _user) external view returns (User memory);
    function isRegistered(address user) external view returns (bool);
    function updateReputation(address user, uint256 newReputation) external;
}

contract SimpleEscrow {
    IUserRegistry public userRegistry;

    enum ProjectStatus { Active, Submitted, Completed, Disputed }

    struct Project {
        address client;
        address freelancer;
        uint256 amount;
        string descriptionCID; // Lighthouse IPFS hash
        string deliverableCID; // Lighthouse IPFS hash
        ProjectStatus status;
        uint256 createdAt;
        uint256 deadline;
        uint256 chainId; // Track deployment chain
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(uint256 indexed projectId, address indexed client, address indexed freelancer, uint256 amount);
    event WorkSubmitted(uint256 indexed projectId, string deliverableCID);
    event ProjectCompleted(uint256 indexed projectId);

    constructor(address _userRegistry) {
        userRegistry = IUserRegistry(_userRegistry);
    }

    modifier onlyRegistered() {
        require(userRegistry.isRegistered(msg.sender), "Must be a registered user");
        _;
    }

    modifier onlyClient(uint256 _projectId) {
        require(projects[_projectId].client == msg.sender, "Only the client can perform this action");
        _;
    }

    modifier onlyFreelancer(uint256 _projectId) {
        require(projects[_projectId].freelancer == msg.sender, "Only the freelancer can perform this action");
        _;
    }

    function createProject(
        address _freelancer,
        string memory _descriptionCID,
        uint256 _deadline
    ) external payable onlyRegistered returns (uint256) {
        require(msg.value > 0, "Must fund project");
        require(_deadline > block.timestamp, "Invalid deadline");
        require(userRegistry.isRegistered(_freelancer), "Freelancer not registered");

        uint256 projectId = ++projectCount;
        projects[projectId] = Project({
            client: msg.sender,
            freelancer: _freelancer,
            amount: msg.value,
            descriptionCID: _descriptionCID,
            deliverableCID: "",
            status: ProjectStatus.Active,
            createdAt: block.timestamp,
            deadline: _deadline,
            chainId: block.chainid
        });

        emit ProjectCreated(projectId, msg.sender, _freelancer, msg.value);
        return projectId;
    }

    function submitWork(
        uint256 _projectId,
        string memory _deliverableCID
    ) external onlyFreelancer(_projectId) {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Project not active");
        require(block.timestamp <= project.deadline, "Submission is past the deadline");

        project.deliverableCID = _deliverableCID;
        project.status = ProjectStatus.Submitted;
        emit WorkSubmitted(_projectId, _deliverableCID);
    }

    function approveWork(uint256 _projectId) external onlyClient(_projectId) {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Submitted, "Work has not been submitted");

        project.status = ProjectStatus.Completed;

        // Get the freelancer's current profile to read their reputation
        IUserRegistry.User memory freelancer = userRegistry.getUser(project.freelancer);
        uint256 currentReputation = freelancer.reputation;

        // Update the reputation (e.g., add 10 points for a completed project)
        userRegistry.updateReputation(project.freelancer, currentReputation + 10);

        (bool success, ) = payable(project.freelancer).call{value: project.amount}("");
        require(success, "Failed to send funds");

        emit ProjectCompleted(_projectId);
    }

    function getProject(uint256 _projectId) external view returns (Project memory) {
        return projects[_projectId];
    }
}