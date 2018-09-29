App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        // Load pets.
        $.getJSON('../pets.json', function(data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');

            for (i = 0; i < data.length; i++) {
                petTemplate.find('.panel-title').text(data[i].name);
                petTemplate.find('img').attr('src', data[i].picture);
                petTemplate.find('.pet-total').text(data[i].total);
                petTemplate.find('.pet-stock').text(data[i].stock);
                petTemplate.find('.pet-own').text(data[i].own);
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                petsRow.append(petTemplate.html());
            }
        });

        return App.initWeb3();
    },

    initWeb3: function() {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function() {
        $.getJSON('TreePresell.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var TreePresellArtifact = data;
            App.contracts.Adoption = TruffleContract(TreePresellArtifact);

            // Set the provider for our contract
            App.contracts.Adoption.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.markAdopted();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
    },

    markAdopted: function(adopters, account) {
        var adoptionInstance;

        App.contracts.Adoption.deployed().then(function(instance) {
            adoptionInstance = instance;

            return adoptionInstance.getSellInfo.call();
        }).then(function([trees, mine]) {
            console.log(trees);
            console.log(mine);
            for (i = 0; i < trees.length; i++) {
                console.log(trees[i].toString(10));
                console.log($('.panel-pet').eq(i).find('.pet-stock'));
                var stock = parseInt(trees[i].toString(10));
                $('.panel-pet').eq(i).find('.pet-stock').text(stock);
                $('.panel-pet').eq(i).find('.pet-own').text(mine[i].toString(10));
                if (stock === 0) {
                    $('.panel-pet').eq(i).find('button').text('售罄').attr('disabled', true);
                }
                // if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                //     $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
                // }
            }
        }).catch(function(err) {
            console.log(err.message);
        });
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

            App.contracts.Adoption.deployed().then(function(instance) {
                adoptionInstance = instance;

                // Execute adopt as a transaction by sending account
                return adoptionInstance.buy(petId, { from: account, value: web3.toWei(64, "ether") });
            }).then(function(result) {
                return App.markAdopted();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    }

};

$(function() {
    $(window).load(function() {
        App.init();
    });
});