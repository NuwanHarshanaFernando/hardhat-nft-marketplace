const { ethers } = require("hardhat")

const PRICE = ethers.parseEther("0.1")

async function mintAndList(){
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    console.log("Minting...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt =  await mintTx.wait(1)
    console.log(mintTxReceipt)
   // const tokenId = mintTxReceipt.events[0].args.tokenId
        // Better way to get tokenId (assuming ERC721)
        const transferEvent = mintTxReceipt.logs.find(
            log => log.fragment && log.fragment.name === "Transfer"
        );
        
        if (!transferEvent) {
            throw new Error("No Transfer event emitted");
        }

    const tokenId = transferEvent.args.tokenId;

    console.log("Approving NFTs...")

    const approvalTx = await basicNft.approve(nftMarketplace.target, tokenId)
    await approvalTx.wait(1)
    console.log("Listing NFT...")
    const tx = await nftMarketplace.listItem(basicNft.target, tokenId, PRICE)
    await tx.wait(1)
    console.log("Listed!")
}

mintAndList()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})