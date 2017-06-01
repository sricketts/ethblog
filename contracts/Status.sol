pragma solidity ^0.4.2;

// import "./ConvertLib.sol";

contract Status {
  mapping (address => bytes32) statuses;

  event StatusUpdate(address indexed _from, bytes32 _value);

  function Status() {
  }

  function update(bytes32 status) {
    statuses[msg.sender] = status;
    StatusUpdate(msg.sender, status);    
  }
  
  function get(address addr) returns(bytes32){
    return statuses[addr];
  }
  
}
