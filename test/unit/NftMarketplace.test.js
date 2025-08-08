const {assert, expect} = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name) ? describe.skip : describe("Nft Marketplace Tests", function(){
    let nftMarketplace, basicNft, deployer, player
    const PRICE = ethers.parseEther("0.1")
    const TOKEN_ID = 0
    beforeEach(async function(){
    
         deployer = (await getNamedAccounts()).deployer
         const accounts = await ethers.getSigners()
         player = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplace = await ethers.getContract("NftMarketplace")
              basicNft = await ethers.getContract("BasicNft")
        
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplace.target, TOKEN_ID)
    
    })

    it("lists and can be bought", async function(){
        await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
        const playerConnectedNftMarketplace = nftMarketplace.connect(player)
        await playerConnectedNftMarketplace.buyItem(basicNft.target, TOKEN_ID, {value: PRICE})
        const newOwner = await basicNft.ownerOf(TOKEN_ID)
        const deployerProceeds = await nftMarketplace.getProceeds(deployer)
        assert(newOwner.toString() == player.address)
        assert(deployerProceeds.toString() == PRICE.toString())
    })

     describe("listItem", function () {
              it("emits an event after listing an item", async function () {
                  expect(await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)).to.emit(
                      "ItemListed"
                  )
              })

            it("exclusively items that haven't been listed", async function () {
                  await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
                  const error = `AlreadyListed("${basicNft.target}", ${TOKEN_ID})`
                    await expect(
                        nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
                    ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__AlreadyListed")
                //   await expect(
                //       nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
                //   ).to.be.revertedWith(error)
              })

                 it("exclusively allows owners to list", async function () {
                 // nftMarketplace = nftMarketplaceContract.connect(user)
                  const playerConnectedNftMarketplace = nftMarketplace.connect(player)
                  await basicNft.approve(player.address, TOKEN_ID)
                  await expect(
                      playerConnectedNftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketPlace__NotOwner")
              })

                 it("needs approvals to list item", async function () {
                  await basicNft.approve(ethers.ZeroAddress, TOKEN_ID)
                  await expect(
                      nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__NotApprovedForMarketplace")
              })

                it("Updates listing with seller and price", async function () {
                  await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
                  const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID)
                  assert(listing.price.toString() == PRICE.toString())
                  assert(listing.seller.toString() == deployer)
              })

               it("reverts if the price be 0", async () => {
                const ZERO_PRICE = ethers.parseEther("0")
                await expect(
                    nftMarketplace.listItem(basicNft.target, TOKEN_ID, ZERO_PRICE)
                ).revertedWithCustomError(nftMarketplace, "NftMarketplace__PriceMustBeAboveZero")
        })
     })

      describe("cancelListing", function () {
        it("reverts if there is no listing", async function () {
                  const error = `NotListed("${basicNft.target}", ${TOKEN_ID})`
                  await expect(
                      nftMarketplace.cancelListing(basicNft.target, TOKEN_ID)
                  ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__NotListed")
              })

                it("reverts if anyone but the owner tries to call", async function () {
                  await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
                  const playerConnectedNftMarketplace = nftMarketplace.connect(player)
                  await basicNft.approve(player.address, TOKEN_ID)
                  await expect(
                      playerConnectedNftMarketplace.cancelListing(basicNft.target, TOKEN_ID)
                  ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketPlace__NotOwner")
              })

            it("emits event and removes listing", async function () {
                  await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
                  expect(await nftMarketplace.cancelListing(basicNft.target, TOKEN_ID)).to.emit(
                      "ItemCanceled"
                  )
                  const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID)
                  assert(listing.price.toString() == "0")
              })
      })

})