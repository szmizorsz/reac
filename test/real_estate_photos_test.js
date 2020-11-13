
const RealEstatePhotos = artifacts.require("RealEstatePhotos");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.BN;

contract("RealEstatePhotos", async function (accounts) {
    let instance;

    beforeEach(async function () {
        instance = await RealEstatePhotos.new();
    });

    afterEach(async function () {
        await instance.destroy();
    });

    it("should register real estate photo", async function () {
        let realEstateId = 1;
        let cid = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        let result = await instance.registerRealEstatePhoto(realEstateId, cid);
        truffleAssert.eventEmitted(result, 'RealEstatePhotoRegistration');
        truffleAssert.eventEmitted(result, 'RealEstatePhotoRegistration', (e) => {
            return e.realEstateId.toNumber() === 1
                && e.cid === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        }, 'event params incorrect');
    });

    it("should return the nr of photos registered", async function () {
        let realEstateId = 1;
        let cid1 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe1";
        let cid2 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe2";
        await instance.registerRealEstatePhoto(realEstateId, cid1);
        await instance.registerRealEstatePhoto(realEstateId, cid2);
        let nrOfRealEstatePhotos = await instance.getNrOfRealEstatePhotos(realEstateId);
        assert(nrOfRealEstatePhotos.toNumber() === 2);
    });

    it("should get the cid of the photo registered", async function () {
        let realEstateId = 1;
        let cid1 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe1";
        let cid2 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe2";
        await instance.registerRealEstatePhoto(realEstateId, cid1);
        await instance.registerRealEstatePhoto(realEstateId, cid2);
        let nrOfRealEstatePhotos = await instance.getNrOfRealEstatePhotos(realEstateId);
        let cid1fRegisteredRealEstatePhoto = await instance.getfRealEstatePhotoCidOfIndex(realEstateId, 0);
        let cid2fRegisteredRealEstatePhoto = await instance.getfRealEstatePhotoCidOfIndex(realEstateId, 1);
        assert(cid1fRegisteredRealEstatePhoto === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe1");
        assert(cid2fRegisteredRealEstatePhoto === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe2");
    });

});



