pragma solidity ^0.4.24;

contract TreePresell {
    uint constant TREE_TYPE = 8;
    uint constant TREE_AMOUNT = 6;
    uint constant TREE_PRICE = 64 ether;

    address owner;

    address[][TREE_TYPE] private treeOwners;

    event TreeBeBought(uint[TREE_TYPE] trees);

    constructor() public payable {
        owner = msg.sender;
    }

    function buy(uint treeType) public payable returns (uint[TREE_TYPE], uint[TREE_TYPE]) {
        require(msg.value == TREE_PRICE);
        require(treeType >= 0 && treeType < TREE_TYPE);
        require(treeOwners[treeType].length < TREE_AMOUNT);
        
        treeOwners[treeType].push(msg.sender);
        owner.transfer(msg.value);

        (uint[TREE_TYPE] memory trees, uint[TREE_TYPE] memory mine) = getSellInfo();

        emit TreeBeBought(trees);

        return (trees, mine);
    }

    function getSellInfo() public view returns (uint[TREE_TYPE], uint[TREE_TYPE]) {
        uint[TREE_TYPE] memory trees;
        uint[TREE_TYPE] memory mine;
        for (uint i = 0; i < TREE_TYPE; i++) {
            trees[i] = TREE_AMOUNT - treeOwners[i].length;
            mine[i] = 0;
            for (uint index = 0; index < treeOwners[i].length; index++) {
                if (treeOwners[i][index] == msg.sender) {
                    mine[i]++;
                }
            }
        }
        return (trees, mine);
    }

    function getBalance() public view returns (uint) {
        require(msg.sender == owner);
        return address(this).balance;
    }

    function viewData(uint treeType) public view returns (address[]) {
        require(msg.sender == owner);
        require(treeType >=0 && treeType < TREE_AMOUNT);
        return treeOwners[treeType];
    }
}