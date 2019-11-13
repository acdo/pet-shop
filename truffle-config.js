const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "quit claim logic melody when syrup kid trap nasty call fury document tomato regular sting";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },

    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/2441107f502b449f8af116c17069ca80")
      },
      network_id: 3
    }  
  }
};
