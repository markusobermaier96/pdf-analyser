// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getLatestPrice() public view returns (uint256) {
        // prettier-ignore
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        (,int price,,,) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function convertToUsd(uint256 weiAmount) public view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        uint256 usdAmount = (ethPrice * weiAmount) / 1e36;
        return usdAmount;
    }

    function convertToWei(uint256 pennyAmount) public view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        uint256 weiAmount = (pennyAmount * 1e16) / ethPrice;
        return weiAmount;
    }
}