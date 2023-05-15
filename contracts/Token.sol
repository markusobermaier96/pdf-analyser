// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Token is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;
    uint256 initialSupply = 70_000_000 * (10 ** decimals());

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only the owner can call this function');
        _;
    } 

    constructor(uint256 cap, uint256 reward) ERC20('PdfAnalyserToken', 'PDF') ERC20Capped(cap * (10 ** decimals())) {
        owner = payable(msg.sender);
        _mint(owner, initialSupply);
        blockReward = reward * (10 ** decimals());
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20Capped) {
        super._mint(account, amount);
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** decimals());
    }

    function _beforeTokenTransfer(address from, address to, uint256 value) internal virtual override {
        if (from != address(0) && to != block.coinbase && block.coinbase != address(0)) {
            _mintMinerReward();
        }
        super._beforeTokenTransfer(from, to, value);
    }
}