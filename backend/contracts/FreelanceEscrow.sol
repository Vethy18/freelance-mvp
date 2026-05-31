// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FreelanceEscrow {

    address public client;
    address public freelancer;

    uint public totalBudget;
    uint public milestones;

    enum Status { Pending, Submitted, Approved, Paid }

    mapping(uint => Status) public milestoneStatus;

    // 🔥 ADD THIS EVENT
    event PaymentReleased(
        address indexed freelancer,
        uint amount,
        uint milestone
    );

    constructor(address _freelancer, uint _milestones) payable {
        require(_freelancer != address(0), "Invalid freelancer");
        require(_milestones > 0, "Milestones must be > 0");

        client = msg.sender;
        freelancer = _freelancer;
        totalBudget = msg.value;
        milestones = _milestones;

        for (uint i = 0; i < milestones; i++) {
            milestoneStatus[i] = Status.Pending;
        }
    }

    function submitWork(uint index) public {
        require(msg.sender == freelancer, "Only freelancer");
        require(index < milestones, "Invalid milestone");
        require(milestoneStatus[index] == Status.Pending, "Already submitted");

        milestoneStatus[index] = Status.Submitted;
    }

    function approveWork(uint index) public {
        require(msg.sender == client, "Only client");
        require(index < milestones, "Invalid milestone");
        require(milestoneStatus[index] == Status.Submitted, "Not submitted");

        milestoneStatus[index] = Status.Approved;
    }

    function releasePayment(uint index) public {
        require(msg.sender == client, "Only client");
        require(index < milestones, "Invalid milestone");
        require(milestoneStatus[index] == Status.Approved, "Not approved");

        uint payment = totalBudget / milestones;

        milestoneStatus[index] = Status.Paid;

        payable(freelancer).transfer(payment);

        // 🔥 EMIT EVENT
        emit PaymentReleased(freelancer, payment, index);
    }

    function getMilestoneStatus(uint index) public view returns (Status) {
        require(index < milestones, "Invalid milestone");
        return milestoneStatus[index];
    }
}