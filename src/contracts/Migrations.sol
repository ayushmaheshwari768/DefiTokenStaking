pragma solidity >=0.4.21 <0.6.0;

contract Migrations {

  address public owner;
  uint public last_migration;


  constructor() public {
    owner = msg.sender;
  }

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function setCompleted(uint done) public restricted {
    last_migration = done;
  }

  function upgrade(address new_address) public restricted {
    Migrations update = Migrations(new_address);
    update.setCompleted(last_migration);
  }
  
}
