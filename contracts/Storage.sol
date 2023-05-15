// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import './Funding.sol';

contract Storage {
    struct Owner {
        address payable self;
        address[] funders;
        uint256 totalReward;
    }
    struct Document {
        Owner owner;
        uint256 uploadTime;
    }
    modifier onlyOwner() {
        require(msg.sender == me);
        _;
    }

    Funding private funding;
    address public me;
    mapping (string => Document) public documents;
    constructor() {
        me = msg.sender;
        funding = new Funding();
    }

    function storeDocument(string memory hash, address payable user) public onlyOwner {
        Owner memory owner = Owner(user, new address[](0), 0);
        documents[hash] = Document(owner, block.timestamp);
    }

    function deleteDocument(string memory hash) public onlyOwner {
        delete documents[hash];
    }

    function useDocument(string memory hash) public payable returns (bool) {
        Owner storage owner = documents[hash].owner;
        if (!(msg.sender == owner.self || msg.sender == me)) {
            owner.totalReward += funding.fund(owner.self);
            owner.funders.push(msg.sender);
            return true;
        }
        return false;
    }
}
