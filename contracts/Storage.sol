// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "./Funding.sol";

error YouAreNotOwner();
error YouAreOwner();
error NoDataAvailable();

contract Storage {
    struct Owner {
        address payable self;
        address[] funders;
        uint256 totalReward;
    }
    struct Document {
        Owner owner;
        uint256 uploadTime;
        bool hasValue;
    }

    Funding private immutable i_funding;
    address public immutable i_me;

    mapping(string => Document) public documents;

    constructor() {
        i_me = msg.sender;
        i_funding = new Funding();
    }

    function storeDocument(
        string memory hash,
        address payable user
    ) public onlyOwner {
        require(!documents[hash].hasValue, "Document already hosted");
        Owner memory owner = Owner(user, new address[](0), 0);
        documents[hash] = Document(owner, block.timestamp, true);
    }

    function deleteDocument(string memory hash) public onlyOwner {
        delete documents[hash];
    }

    function useDocument(string memory hash) public payable {
        if (!documents[hash].hasValue) {
            revert NoDataAvailable();
        }
        Owner memory owner = documents[hash].owner;
        if (msg.sender == owner.self || msg.sender == i_me) {
            revert YouAreOwner();
        }
        owner.totalReward += i_funding.fund(owner.self, msg.value);
    }

    function getSelfReward() public view returns (uint256) {
        return i_funding.selfReward();
    }

    function setSelfReward(uint256 weiAmount) public onlyOwner {
        i_funding.setReward(Funding.RewardType(0), weiAmount);
    }

    function getHostReward() public view returns (uint256) {
        return i_funding.hostReward();
    }

    function setHostReward(uint256 weiAmount) public onlyOwner {
        i_funding.setReward(Funding.RewardType(1), weiAmount);
    }

    modifier onlyOwner() {
        if (msg.sender != i_me) {
            revert YouAreNotOwner();
        }
        _;
    }
}
