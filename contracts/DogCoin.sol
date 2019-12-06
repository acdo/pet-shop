pragma solidity ^0.5.0;

contract DogCoin {

    string public constant name = "DogCoin";
    string public constant symbol = "DGC";
    uint8 public constant decimals = 0;  //only whole token amounts 


    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;
    
    uint256 totalSupply_;

    using SafeMath for uint256;


   constructor() public {  
	totalSupply_ = 100; //100 initial coins 
	balances[msg.sender] = totalSupply_;
    }  

    function totalSupply() public view returns (uint256) {
	return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function myBalance() public view returns (uint) {
        return balanceOf(msg.sender); 
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    //burns the money from owner w/out sending anywhere in particular 
    function burn(uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        emit Transfer(msg.sender, address(0), numTokens);
        return true; 
    }

    //mints new money to caller w/out sending anywhere in particular 
    function mint(uint numTokens) public returns (bool) {
        balances[msg.sender] = balances[msg.sender].add(numTokens);
        emit Transfer(address(0), msg.sender, numTokens);
        return true; 
    }

    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[owner]);    
        require(numTokens <= allowed[owner][msg.sender]);
    
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
    /* buy dogcoin with ethereum */ 
    function buyDogCoin(uint amount) public payable returns (bool) {
        return mint(amount);      
    }

}

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}