// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "./PriceConverter.sol";

error ValueMismatch();

contract Funding {
    using PriceConverter for uint256;

    enum RewardType { SELF, HOST }
    uint256 public selfReward = 600_000_000_000_000;
    uint256 public hostReward = 600_000_000_000_000;

    function fund(address payable _to, uint256 value) public payable returns (uint256) {
        if (value != hostReward) {
            revert ValueMismatch();
        }
        (bool sent,) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        return hostReward;
    }

    function setReward(RewardType rewardType, uint256 weiAmount) external {
        if (rewardType == RewardType.HOST) {
            hostReward = weiAmount;
        } else if (rewardType == RewardType.SELF) {
            selfReward = weiAmount;
        } 
    }

    receive() external payable {
        revert();
    }

    fallback() external payable {
        revert();
    }
}
