// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PriceConverter.sol";

contract Funding {
    using PriceConverter for uint256;

    uint256 public constant SELF_REWARD = 0.2 * 1e18;
    uint256 public constant HOST_REWARD = 0.2 * 1e18;

    function fund(address payable _to) public payable returns (uint256) {
        require(msg.value.getConversionRate() == HOST_REWARD, "Doesn't match expected value");
        (bool sent,) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        return msg.value;
    }

}
