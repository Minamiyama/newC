App={web3Provider:null,contracts:{},inited:!1,init:function(){return!0===App.inited||(App.inited=!0,App.initWeb3())},initWeb3:function(){return"undefined"!=typeof web3?App.web3Provider=web3.currentProvider:(console.log("浏览器无钱包插件"),alert("未检测到钱包插件，请在支持DAPP的浏览器中打开"),App.web3Provider=new Web3.providers.HttpProvider("http://localhost:7545")),web3=new Web3(App.web3Provider),App.initContract()},initContract:function(){return $.getJSON("contracts/TreePresell.json",function(t){var n=t;return App.contracts.Adoption=TruffleContract(n),App.contracts.Adoption.setProvider(App.web3Provider),App.watchEvents(),App.getSellInfo()}),App.bindEvents()},watchEvents:function(){App.contracts.Adoption.deployed().then(function(t){t.TreeBeBought(function(t){console.log("收到购买通知"),App.getSellInfo()})})},bindEvents:function(){},getSellInfo:function(){App.contracts.Adoption.deployed().then(function(t){return t.getSellInfo.call()}).then(function(t){var n=t[0],e=t[1];App.fillData(n,e),initTree()}).catch(function(t){console.log(t.message)})},fillData:function(t,n){treeData={yun:{name:"云之树",total:6,stock:parseInt(t[0].toString(10)),mine:parseInt(n[0].toString(10))},tan:{name:"潭之树",total:6,stock:parseInt(t[1].toString(10)),mine:parseInt(n[1].toString(10))},yan:{name:"炎之树",total:6,stock:parseInt(t[2].toString(10)),mine:parseInt(n[2].toString(10))},lei:{name:"雷之树",total:6,stock:parseInt(t[3].toString(10)),mine:parseInt(n[3].toString(10))},di:{name:"地之树",total:6,stock:parseInt(t[4].toString(10)),mine:parseInt(n[4].toString(10))},mai:{name:"脉之树",total:6,stock:parseInt(t[5].toString(10)),mine:parseInt(n[5].toString(10))},liu:{name:"流之树",total:6,stock:parseInt(t[6].toString(10)),mine:parseInt(n[6].toString(10))},feng:{name:"风之树",total:6,stock:parseInt(t[7].toString(10)),mine:parseInt(n[7].toString(10))}}},nameOrder:["yun","tan","yan","lei","di","mai","liu","feng"],handleBuy:function(t){var o=App.nameOrder.indexOf(t);console.log("tree index: ",o),web3.eth.getAccounts(function(t,n){t&&console.log(t);var e=n[0];App.contracts.Adoption.deployed().then(function(t){return t.buy(o,{from:e,value:web3.toWei(64,"ether")})}).then(function(t){return console.log(t),App.getSellInfo()}).catch(function(t){console.log(t.message)})})}};