var Adoption = artifacts.require("Adoption");
var DogCoin = artifacts.require("DogCoin"); 

module.exports = function(deployer) {
	deployer.deploy(Adoption);
	deployer.deploy(DogCoin); 
};