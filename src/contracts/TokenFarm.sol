pragma solidity ^0.5.0;

import "./SpartanCoin.sol";
import "./DaiToken.sol";

contract TokenFarm {

    string public name = "Spartan Coin Farm";
    address public owner;
    SpartanCoin public spartanCoin;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public balance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    constructor(SpartanCoin _spartanCoin, DaiToken _daiToken) public {
        spartanCoin = _spartanCoin;
        daiToken = _daiToken;
        owner = msg.sender;
    }


    function stakeTokens(uint _amount) public {
        require(_amount > 0, "amount cannot be 0");

        daiToken.transferFrom(msg.sender, address(this), _amount);

        balance[msg.sender] = balance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }


    function unstakeTokens() public {
        uint bal = balance[msg.sender];
        require(bal > 0, "staking balance cannot be 0");
        daiToken.transfer(msg.sender, bal);
        balance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }


    function issueTokens() public {
        require(msg.sender == owner, "caller must be the owner");

        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint bal = balance[recipient];
            if(bal > 0) {
                spartanCoin.transfer(recipient, bal);
            }
        }
    }
}
