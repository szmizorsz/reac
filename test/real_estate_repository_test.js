const ReacAccessControl = artifacts.require("ReacAccessControl");
const RealEstateRepository = artifacts.require("RealEstateRepository");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.BN;

contract("RealEstateRepository", async function (accounts) {
	let instance;
	const realEstateRegister = accounts[2];
	const notRealEstateRegister = accounts[3];
	let reacAccessControlInstance;

	beforeEach(async function () {
		reacAccessControlInstance = await ReacAccessControl.new();
		const realEstateRegisterRole = await reacAccessControlInstance.getRealEstateRegisterRole();
		await reacAccessControlInstance.grantRole(realEstateRegisterRole, realEstateRegister);
		instance = await RealEstateRepository.new(reacAccessControlInstance.address);
	});

	afterEach(async function () {
		await instance.destroy();
	});

	it("should register real estate", async function () {
		let proprietor = accounts[1];
		let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
		let result = await instance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });
		truffleAssert.eventEmitted(result, 'RealEstateRegistration');
		truffleAssert.eventEmitted(result, 'RealEstateRegistration', (e) => {
			return e.id.toNumber() === 1
				&& e.proprietor === accounts[1]
				&& e.tokenURI === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
		}, 'event params incorrect');
	});

	it("should not register the real estate if the sender does not have real estate register role", async function () {
		let proprietor = accounts[1];
		let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
		await truffleAssert.reverts(
			instance.registerRealEstate(proprietor, tokenURI, { from: notRealEstateRegister }),
			"Caller does not have real estate register role");
	});

	it("should return the registered real estate by id", async function () {
		let proprietor = accounts[0];
		let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
		await instance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });
		let tokenURIRegistered = await instance.tokenURI(1);
		assert(tokenURIRegistered === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe");
	});

});

