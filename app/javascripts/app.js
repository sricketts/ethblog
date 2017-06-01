// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import status_artifacts from '../../build/contracts/Status.json'

var Status = contract(status_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
    start: function() {
	var self = this;

	Status.setProvider(web3.currentProvider);

	web3.eth.getAccounts(function(err, accs) {
	    if (err != null) {
		alert("There was an error fetching your accounts.");
		return;
	    }

	    if (accs.length == 0) {
		alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
		return;
	    }
	    
	    accounts = accs;
	    account = accounts[0];
	    
	    self.refreshStatus();
	});
    },

  setAppStatus: function(message) {
    var status = document.getElementById("app_status");
    status.innerHTML = message;
  },

  refreshStatus: function() {
    var self = this;

    var status;
    Status.deployed().then(function(instance) {
      status = instance;
      return status.get.call(account, {from: account});
    }).then(function(value) {
      var status_element = document.getElementById("status");
	status_element.innerHTML = web3.toAscii(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      self.setAppStatus("Error getting status; see log.");
    });
  },

  setStatus: function() {
    var self = this;

      var status_message = document.getElementById("new_status").value;
      
    this.setAppStatus("Initiating transaction... (please wait)");

    var status;
    Status.deployed().then(function(instance) {
	status = instance;
	return status.update(web3.fromAscii(status_message, 32), {from: account});
    }).then(function() {
      self.setAppStatus("Transaction complete!");
      self.refreshStatus();
    }).catch(function(e) {
      console.log(e);
      self.setAppStatus("Error setting status; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
