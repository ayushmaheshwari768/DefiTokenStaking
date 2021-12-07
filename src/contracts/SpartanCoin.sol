pragma solidity ^0.5.0;

contract SpartanCoin {

    string  public name = "Spartan Coin";
    string  public symbol = "SPARTAN";
    uint256 public supply = 1000000000000000000000000; // 1 million tokens
    uint8   public decimals = 18;


    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );


    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    

    mapping(address => uint256) public balance;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balance[msg.sender] = supply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balance[msg.sender] >= _value);
        balance[msg.sender] -= _value;
        balance[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balance[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balance[_from] -= _value;
        balance[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}
