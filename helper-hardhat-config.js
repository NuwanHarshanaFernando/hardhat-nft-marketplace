const { ethers } = require("hardhat")

const networkConfig = {
    11155111: {
        name: "sepolia",
        vrfCoordinatorV2: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
       // entranceFee: ethers.utils.parseEther("0.01"),
        entranceFee: ethers.parseEther("0.01"),
        gasLane: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        subscriptionId: "7399647949254324747313642538347699474131487154543094178533628410601050572543",
        callbackGasLimit: "500000", // 500,000
        interval: "30",
    },
    31337: {
        name: "hardhat",
       // entranceFee: ethers.utils.parseEther("0.01"),
        entranceFee: ethers.parseEther("0.01"),
        gasLane: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        callbackGasLimit: "500000", // 500,000
        interval: "30",
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains
}