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

We want a mapping

NFT Contract address -> NFT TokenID -> Listing
mapping(address => mapping(uint256 => Listing))

We need a struct to store price and seller of the NFT

 struct Listing {
        uint256 price;
        uint256 seller;
 }

 Create a modifier to check whether nft is already listed
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

