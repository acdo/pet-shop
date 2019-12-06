App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length - 1; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.pet-price').text(data[i].price);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }

      // Now load dogcoin
      var coinRow = $('#coinRow');
      var coinTemplate = $('#coinTemplate');
      coinTemplate.find('.panel-title').text(data[16].name);
      coinTemplate.find('.coin-price').text(data[16].price);
      coinRow.append(coinTemplate.html());
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
   // Modern dapp browsers...
   if (window.ethereum) {
     App.web3Provider = window.ethereum;
     try {
       // Request account access
       await window.ethereum.enable();
     } catch (error) {
       // User denied account access...
       console.error("User denied account access")
     }
   }
   // Legacy dapp browsers...
   else if (window.web3) {
     App.web3Provider = window.web3.currentProvider;
   }
   // If no injected web3 instance is detected, fall back to Ganache
   else {
     App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
   }
   web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });
    // Initialize the Dogcoin contract 
    $.getJSON('DogCoin.json', function(data) {

      var DogCoinArtifact = data;
      App.contracts.DogCoin = TruffleContract(DogCoinArtifact);
      App.contracts.DogCoin.setProvider(App.web3Provider);

    })

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-coin', App.handleCoin); 
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  /* 'sends' dogCoin by burning it into nothingness */
  sendDogCoin: function(amount) {
    var dogCoinInstance; 
    
    App.contracts.DogCoin.deployed().then(function(instance) {
        dogCoinInstance = instance; 
        return dogCoinInstance.burn(amount);
      }).catch(function(err) {
      console.log(err.message);
    });
    return true; 
  },

  /* Update the current displayed coin amount of coins */ 
  updateValue: function(){
    App.contracts.DogCoin.deployed().then(function(instance) {
        dogCoinInstance = instance; 
        return dogCoinInstance.myBalance();
      }).then(function(result){
        var balance = result.toString(); 
        alert(`you now have ${balance} coins`); 
        console.log(balance); 
        $('#curr_balance').text(balance);
      });
      return true; 
  }, 


  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      
      var petPrice; 

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.getPrice(petId);
      }).then(function(result) {
        petPrice = parseInt(result);
        console.log(petPrice);
        // const wei = web3.toWei(Number(petPrice), 'ether');
        // send amount in dog coin? 

        // Execute adopt as a transaction by sending account
        // First send money 
        return App.sendDogCoin(petPrice);
      }).then(function(result){
        return adoptionInstance.adopt(petId);
      }).then(function(result) {
        return App.markAdopted();
      }).then(function(result){
        App.updateValue(); //change the displayed amount of coins 
      }).catch(function(err) {
        console.log(err.message);
      });

      //then send DogCoin
      //console.log(petPrice); 
      //App.sendDogCoin(petPrice);

    });
  },

  //handle events of buying additional coins on the dialogue, where it should require sending 
  //ethereum and then change the amount of coins displayed 
  handleCoin: function(event) {
    //event.preventDefault();
    
    // this needs to send in ethereum 
    var dogCoinInstance; 
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

    var account = accounts[0];
    App.contracts.DogCoin.deployed().then(function(instance) {
        dogCoinInstance = instance;
        const wei = web3.toWei(1, 'ether'); 
        return dogCoinInstance.buyDogCoin(1, {from: account, value: wei}); 
      }).then(function(result){
        return App.updateValue();    
      }).catch(function(err) {
        console.log(err.message);
      });
  })
}, 


}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
