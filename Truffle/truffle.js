var HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*", // Match any network id
            gasPrice: 1000000000000,
            gas: 7000000
        },
        ropsten: {
            provider: function() {
                return new HDWalletProvider("case board draw enforce gadget wing side trick purse half recall clap",
                    "https://ropsten.infura.io/v3/8aceda12f8da480eadcedeb92fb23c2d");
            },
            network_id: 3
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider("case board draw enforce gadget wing side trick purse half recall clap",
                    "https://rinkeby.infura.io/v3/8aceda12f8da480eadcedeb92fb23c2d");
            },
            network_id: 4
        },
        kovan: {
            provider: function() {
                return new HDWalletProvider("case board draw enforce gadget wing side trick purse half recall clap",
                    "https://kovan.infura.io/v3/8aceda12f8da480eadcedeb92fb23c2d");
            },
            network_id: 42
        },
        mainnet: {
            provider: function() {
                let provider = new HDWalletProvider("case board draw enforce gadget wing side trick purse half recall clap",
                    "https://mainnet.infura.io/v3/8aceda12f8da480eadcedeb92fb23c2d");
                // console.log(provider);
                return provider;
            },
            network_id: 1,
            gasPrice: 10000000000,
            gas: 600000
        }
    }
};