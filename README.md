1. Create a decentralized NFT Marketplace
    1. `listItem`: List NFTs on the marketplace
    2. `buyItem`: Buy the NFTs
    3. `cancelItem`: Cancel a listing
    4. `updateListings`: Update Price
    5. `withdrawProceeds` Withdraw payment for my bought NFTs

Create NFTMarketplace.sol inside contracts folder

There are 2 options

 1. Send the NFT to the contract. Transfer -> Contract "hold" the Nft
 2. Owners can still hold their NFT, and give the marketplace approval
     to sell the NFT for them.

* In this case, we're following the second method

We want to install OpenZeppelin ERC-721

```
yarn add --dev @openzeppelin/contracts
```

## List Item Function

We want a mapping

NFT Contract address -> NFT TokenID -> Listing
mapping(address => mapping(uint256 => Listing))

We need a struct to store price and seller of the NFT

 struct Listing {
        uint256 price;
        uint256 seller;
 }

 Create a modifier to check whether nft is NOT already listed
 ```
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }
    ```

  and add this modifier to function listItem()  

  Create a modifier to check whether the owner
  ```
    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketPlace__NotOwner();
        }
        _;
    }
    ```

      and add this modifier to function listItem()


## Buy Item Function

We can add tokenPayment (chainlink price feeds) to the function listItem()

function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        address tokenPayment // chainlink price feeds
    )

    Challenge: Have this contract accept payment in a subset of tokens as well
    Hint: Use Chainlink Price Feeds to convert the price of the tokens between each other

Create a modifier to check whether nft is listed

```
 modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }
```

and add this modifier to function buyItem()

To track how much money people have earned by selling NFTs, 
we have to create another data structure

    Seller address -> Amount earned
    mapping(address => uint256) private s_proceeds;

When somebody buys an item, we need to update the s_proceeds

There are 2 attacks in the world
1. Reentrancy Attacks
2. Oracle attacks

Import Openzeppelin ReentrancyGuard
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

```
contract NftMarketplace is ReentrancyGuard {}

```

Add nonReentrant to buyItem() function

```
    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable nonReentrant isListed(nftAddress, tokenId) {}
```









