const ReacAccessControl = artifacts.require("ReacAccessControl");
const RealEstateRepository = artifacts.require("RealEstateRepository");
const RealEstatePhotos = artifacts.require("RealEstatePhotos");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.BN;

contract("RealEstatePhotos", async function (accounts) {
    let instance;
    let realEstateRepositoryInstance;
    const realEstateRegister = accounts[2];
    let reacAccessControlInstance;

    beforeEach(async function () {
        reacAccessControlInstance = await ReacAccessControl.new();
        const realEstateRegisterRole = await reacAccessControlInstance.getRealEstateRegisterRole();
        await reacAccessControlInstance.grantRole(realEstateRegisterRole, realEstateRegister);
        realEstateRepositoryInstance = await RealEstateRepository.new(reacAccessControlInstance.address);
        instance = await RealEstatePhotos.new(realEstateRepositoryInstance.address);
    });

    afterEach(async function () {
        await instance.destroy();
    });

    it("should register real estate photo", async function () {
        let proprietor = accounts[1];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let cid = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        let description = "Reconstruction";
        let result = await instance.registerRealEstatePhoto(realEstateId, cid, description, { from: proprietor });
        truffleAssert.eventEmitted(result, 'RealEstatePhotoRegistration');
        truffleAssert.eventEmitted(result, 'RealEstatePhotoRegistration', (e) => {
            return e.realEstateId.toNumber() === 1
                && e.cid === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe"
                && e.description === "Reconstruction";
        }, 'event params incorrect');
    });

    it("should not register real estate photo if not the owner sends it", async function () {
        let proprietor = accounts[1];
        let notProprietor = accounts[2];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let cid = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        let description = "Reconstruction";


        await truffleAssert.reverts(
            instance.registerRealEstatePhoto(realEstateId, cid, description, { from: notProprietor }),
            "msg.sender is not the proprietor");
    });

    it("should return the nr of photos registered", async function () {
        let proprietor = accounts[1];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let cid1 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe1";
        let description1 = "Reconstruction";
        let cid2 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe2";
        let description2 = "Reconstruction";
        await instance.registerRealEstatePhoto(realEstateId, cid1, description1, { from: proprietor });
        await instance.registerRealEstatePhoto(realEstateId, cid2, description2, { from: proprietor });
        let nrOfRealEstatePhotos = await instance.getNrOfRealEstatePhotos(realEstateId);
        assert(nrOfRealEstatePhotos.toNumber() === 2);
    });

    it("should get the photo registered", async function () {
        let proprietor = accounts[1];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let cid1 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe1";
        let description1 = "Reconstruction1";
        let cid2 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe2";
        let description2 = "Reconstruction2";
        await instance.registerRealEstatePhoto(realEstateId, cid1, description1, { from: proprietor });
        await instance.registerRealEstatePhoto(realEstateId, cid2, description2, { from: proprietor });
        let realEstatePhoto1 = await instance.getRealEstatePhotoOfIndex(realEstateId, 0);
        let realEstatePhoto2 = await instance.getRealEstatePhotoOfIndex(realEstateId, 1);
        assert(realEstatePhoto1.cid === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe1");
        assert(realEstatePhoto1.description === "Reconstruction1");
        assert(realEstatePhoto2.cid === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe2");
        assert(realEstatePhoto2.description === "Reconstruction2");
    });

});



