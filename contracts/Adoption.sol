pragma solidity ^0.5.0;

contract Adoption {
	address[16] public adopters;
	uint[16] public prices;

	// Adopting a pet
	function adopt(uint petId) public payable returns (uint) {
		require(petId >= 0 && petId <= 15);

		adopters[petId] = msg.sender;
		prices[petId] = msg.value;

		return petId;
	}

	// Retrieving the adopters
	function getAdopters() public view returns (address[16] memory) {
		return adopters;
	}
}