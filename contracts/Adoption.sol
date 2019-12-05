pragma solidity ^0.5.0;

contract Adoption {
	address[16] public adopters;
	uint[16] public prices = [3, 3, 2, 2, 5, 1, 3, 3, 2, 1, 3, 2, 5, 3, 2, 1];

	// Adopting a pet
	function adopt(uint petId) public payable returns (uint) {
		require(petId >= 0 && petId <= 15);

		adopters[petId] = msg.sender;
		

		return petId;
	}

	// Retrieving the adopters
	function getAdopters() public view returns (address[16] memory) {
		return adopters;
	}

	// Retrieve price
	function getPrice(uint petId) public view returns (uint) {
		require(petId >= 0 && petId <= 15);
		return prices[petId];
	}
}