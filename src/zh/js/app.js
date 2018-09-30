App = {
    web3Provider: null,
    contracts: {},
    inited: false,

    init: function() {
        // Load pets.
        // $.getJSON('../pets.json', function(data) {
        //     var petsRow = $('#petsRow');
        //     var petTemplate = $('#petTemplate');

        //     for (i = 0; i < data.length; i++) {
        //         petTemplate.find('.panel-title').text(data[i].name);
        //         petTemplate.find('img').attr('src', data[i].picture);
        //         petTemplate.find('.pet-total').text(data[i].total);
        //         petTemplate.find('.pet-stock').text(data[i].stock);
        //         petTemplate.find('.pet-own').text(data[i].own);
        //         petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        //         petsRow.append(petTemplate.html());
        //     }
        // });
        if (App.inited) {
            return;
        }
        App.inited = true;

        return App.initWeb3();
    },

    initWeb3: function() {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            console.log("浏览器无钱包插件");
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function() {
        $.getJSON('contracts/TreePresell.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var TreePresellArtifact = data;
            App.contracts.Adoption = TruffleContract(TreePresellArtifact);

            // Set the provider for our contract
            App.contracts.Adoption.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.getSellInfo();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
    },

    getSellInfo: function(adopters, account) {
        var adoptionInstance;

        App.contracts.Adoption.deployed().then(function(instance) {
            adoptionInstance = instance;

            return adoptionInstance.getSellInfo.call();
        }).then(function([trees, mine]) {
            console.log(trees);
            console.log(mine);

            App.fillData(trees, mine);
            initTree();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fillData: function(trees, mine) {
        var treeToSell = 6;
        treeData = {
            yun: {
                name: '云之树',
                total: treeToSell,
                stock: parseInt(trees[0].toString(10)),
                mine: parseInt(mine[0].toString(10))
            },
            tan: {
                name: '潭之树',
                total: treeToSell,
                stock: parseInt(trees[1].toString(10)),
                mine: parseInt(mine[1].toString(10))
            },
            yan: {
                name: '炎之树',
                total: treeToSell,
                stock: parseInt(trees[2].toString(10)),
                mine: parseInt(mine[2].toString(10))
            },
            lei: {
                name: '雷之树',
                total: treeToSell,
                stock: parseInt(trees[3].toString(10)),
                mine: parseInt(mine[3].toString(10))
            },
            di: {
                name: '地之树',
                total: treeToSell,
                stock: parseInt(trees[4].toString(10)),
                mine: parseInt(mine[4].toString(10))
            },
            mai: {
                name: '脉之树',
                total: treeToSell,
                stock: parseInt(trees[5].toString(10)),
                mine: parseInt(mine[5].toString(10))
            },
            liu: {
                name: '流之树',
                total: treeToSell,
                stock: parseInt(trees[6].toString(10)),
                mine: parseInt(mine[6].toString(10))
            },
            feng: {
                name: '风之树',
                total: treeToSell,
                stock: parseInt(trees[7].toString(10)),
                mine: parseInt(mine[7].toString(10))
            }
        };
    },

    nameOrder: ["yun", "tan", "yan", "lei", "di", "mai", "liu", "feng"],
    handleBuy: function(treeName) {
        var treeIndex = App.nameOrder.indexOf(treeName);
        console.log("tree index: ", treeIndex);

        var adoptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adoption.deployed().then(function(instance) {
                adoptionInstance = instance;

                // Execute adopt as a transaction by sending account
                return adoptionInstance.buy(treeIndex, { from: account, value: web3.toWei(64, "ether") });
            }).then(function(result) {
                console.log(result);
                // fillData(trees, mine);
                return App.getSellInfo();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    }
};