  
const RealEstateRepository = artifacts.require("RealEstateRepository");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.BN;

contract("RealEstateRepository", async function(accounts){
	let instance;

	beforeEach(async function() {
		instance = await RealEstateRepository.new();
	});

    afterEach(async function () {
        await instance.destroy();
    });

	it("should register real estate", async function() {
		let proprietor = accounts[1];
		let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
		let result = await instance.registerRealEstate(proprietor, tokenURI);
		truffleAssert.eventEmitted(result, 'RealEstateRegistration');
		truffleAssert.eventEmitted(result, 'RealEstateRegistration', (e) => {
					return e.id.toNumber() === 1
						&& e.proprietor === accounts[1]
                        && e.tokenURI === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
                }, 'event params incorrect');
	});

	it("should return the registered real estate by id", async function() {
		let proprietor = accounts[0];
		let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
		await instance.registerRealEstate(proprietor, tokenURI);
		let tokenURIRegistered = await instance.tokenURI(1);
		assert(tokenURIRegistered === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe");
	});

});

