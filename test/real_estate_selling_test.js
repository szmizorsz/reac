const RealEstateRepository = artifacts.require("RealEstateRepository");
const RealEstateSellingFactory = artifacts.require("RealEstateSellingFactory");
const RealEstateSelling = artifacts.require("RealEstateSelling");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.BN;

contract("RealEstateSelling", async function (accounts) {
    let instance;
    let realEstateRepositoryInstance;

    beforeEach(async function () {
        realEstateRepositoryInstance = await RealEstateRepository.new();
        instance = await RealEstateSellingFactory.new(realEstateRepositoryInstance.address);
    });

    afterEach(async function () {
        await realEstateRepositoryInstance.destroy();
        await instance.destroy();
    });

    it("should reject the real estate selling contract registration if not the current owner sends it", async function () {
        let proprietor = accounts[1];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI);
        let realEstateId = 1;
        let buyer = accounts[2];
        let price = 200;
        let dueDate = 3999;
        await truffleAssert.reverts(
            instance.registerSellingContract(
                realEstateId,
                buyer,
                price,
                dueDate
            ),
            "msg.sender is not the proprietor");
    });

    it("should register real estate selling contract", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI);
        let realEstateId = 1;
        let buyer = accounts[1];
        let seller = accounts[0];
        let price = 200;
        let dueDate = 3999;
        let result = await instance.registerSellingContract(
            realEstateId,
            buyer,
            price,
            dueDate
        );
        truffleAssert.eventEmitted(result, 'RealEstateSellingRegistration');
        truffleAssert.eventEmitted(result, 'RealEstateSellingRegistration', (e) => {
            return e.contractId.toNumber() === 1
                && e.realEstateId.toNumber() === realEstateId
                && e.buyer === buyer
                && e.seller === seller
                && e.price.toNumber() === price
                && e.dueDate.toNumber() === dueDate;
        }, 'event params incorrect');
    });

    it("should return the nr of registered real estate selling contract", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI);
        let realEstateId = 1;
        let buyer = accounts[1];
        let price = 200;
        let dueDate = 3999;
        await instance.registerSellingContract(
            realEstateId,
            buyer,
            price,
            dueDate
        );
        let result = await instance.getNrOfSellingContractsByTokenId(realEstateId);
        assert(result.toNumber() === 1);
    });

    it("should return the real estate selling contract", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI);
        let realEstateId = 1;
        let index = 0;
        let buyer = accounts[1];
        let price = 200;
        let dueDate = 3999;
        await instance.registerSellingContract(
            realEstateId,
            buyer,
            price,
            dueDate
        );
        let sellingContractAddress = await instance.getSellingContractByRealEstateIdAndIndex(realEstateId, index);
        let sellingContract = await RealEstateSelling.at(sellingContractAddress);
        let contractIdFromContract = await sellingContract.contractId();
        assert(contractIdFromContract.toNumber() === 1);
        let sellerFromContract = await sellingContract.seller();
        assert(sellerFromContract === accounts[0]);
        let buyerFromContract = await sellingContract.buyer();
        assert(buyerFromContract === accounts[1]);
        let priceFromContract = await sellingContract.price();
        assert(priceFromContract.toNumber() === price);
        let dueDateContract = await sellingContract.dueDate();
        assert(dueDateContract.toNumber() === dueDate);
        let stateContract = await sellingContract.state();
        assert(stateContract.toNumber() === 0);
    });

    it("should confirm the real estate selling contract", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI);
        let realEstateId = 1;
        let buyer = accounts[1];
        let seller = proprietor;
        let price = 200;
        let dueDate = 3999;
        await instance.registerSellingContract(
            realEstateId,
            buyer,
            price,
            dueDate,
            { from: seller }
        );
        let index = 0;
        let sellingContractAddress = await instance.getSellingContractByRealEstateIdAndIndex(realEstateId, index);
        let sellingContract = await RealEstateSelling.at(sellingContractAddress);
        let result = await sellingContract.confirm({ from: buyer });
        truffleAssert.eventEmitted(result, 'SellingContractConfirmation');
        truffleAssert.eventEmitted(result, 'SellingContractConfirmation', (e) => {
            return e.contractId.toNumber() === 1
                && e.realEstateId.toNumber() === realEstateId;
        }, 'event params incorrect');
    });

    it("should not confirm the real estate selling contract that is already confirmed", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI);
        let realEstateId = 1;
        let buyer = accounts[1];
        let seller = proprietor;
        let price = 200;
        let dueDate = 3999;
        await instance.registerSellingContract(
            realEstateId,
            buyer,
            price,
            dueDate,
            { from: seller }
        );
        let index = 0;
        let sellingContractAddress = await instance.getSellingContractByRealEstateIdAndIndex(realEstateId, index);
        let sellingContract = await RealEstateSelling.at(sellingContractAddress);
        await sellingContract.confirm({ from: buyer });
        await truffleAssert.reverts(
            sellingContract.confirm({ from: buyer }),
            "msg.sender is not the buyer or the contract is already confirmed");
    });

    it("should register the recieved payment in the selling contract", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI);
        let realEstateId = 1;
        let buyer = accounts[1];
        let seller = proprietor;
        let price = 200;
        let dueDate = 3999;
        await instance.registerSellingContract(
            realEstateId,
            buyer,
            price,
            dueDate,
            { from: seller }
        );
        let index = 0;
        let sellingContractAddress = await instance.getSellingContractByRealEstateIdAndIndex(realEstateId, index);
        let sellingContract = await RealEstateSelling.at(sellingContractAddress);
        await sellingContract.confirm({ from: buyer });
        let result = await sellingContract.registerRecievedPayment(price, { from: seller });
        truffleAssert.eventEmitted(result, 'SellingContractCompletion');
        truffleAssert.eventEmitted(result, 'SellingContractCompletion', (e) => {
            return e.contractId.toNumber() === 1
                && e.realEstateId.toNumber() === realEstateId;
        }, 'event params incorrect');
        let paidFromContract = await sellingContract.paid();
        let stateFromContract = await sellingContract.state();
        assert(paidFromContract.toNumber() == price);
        assert(stateFromContract.toNumber() == 2);
    });

    it("should withdraw the registered selling contract", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI);
        let realEstateId = 1;
        let buyer = accounts[1];
        let seller = proprietor;
        let price = 200;
        let dueDate = 3999;
        await instance.registerSellingContract(
            realEstateId,
            buyer,
            price,
            dueDate,
            { from: seller }
        );
        let index = 0;
        let sellingContractAddress = await instance.getSellingContractByRealEstateIdAndIndex(realEstateId, index);
        let sellingContract = await RealEstateSelling.at(sellingContractAddress);
        await sellingContract.confirm({ from: buyer });
        let result = await sellingContract.withdraw({ from: seller });
        truffleAssert.eventEmitted(result, 'SellingContractWithdraw');
        truffleAssert.eventEmitted(result, 'SellingContractWithdraw', (e) => {
            return e.contractId.toNumber() === 1
                && e.realEstateId.toNumber() === realEstateId;
        }, 'event params incorrect');
        let stateFromContract = await sellingContract.state();
        assert(stateFromContract.toNumber() == 3);
    });
});
