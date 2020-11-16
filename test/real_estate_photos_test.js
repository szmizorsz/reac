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
        let description = "Reconstruction";
        let result = await instance.registerRealEstatePhoto(realEstateId, cid, description);
        truffleAssert.eventEmitted(result, 'RealEstatePhotoRegistration');
        truffleAssert.eventEmitted(result, 'RealEstatePhotoRegistration', (e) => {
            return e.realEstateId.toNumber() === 1
                && e.cid === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe"
                && e.description === "Reconstruction";
        }, 'event params incorrect');
    });

    it("should return the nr of photos registered", async function () {
        let realEstateId = 1;
        let cid1 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe1";
        let description1 = "Reconstruction";
        let cid2 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe2";
        let description2 = "Reconstruction";
        await instance.registerRealEstatePhoto(realEstateId, cid1, description1);
        await instance.registerRealEstatePhoto(realEstateId, cid2, description2);
        let nrOfRealEstatePhotos = await instance.getNrOfRealEstatePhotos(realEstateId);
        assert(nrOfRealEstatePhotos.toNumber() === 2);
    });

    it("should get the photo registered", async function () {
        let realEstateId = 1;
        let cid1 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe1";
        let description1 = "Reconstruction1";
        let cid2 = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe2";
        let description2 = "Reconstruction2";
        await instance.registerRealEstatePhoto(realEstateId, cid1, description1);
        await instance.registerRealEstatePhoto(realEstateId, cid2, description2);
        let realEstatePhoto1 = await instance.getRealEstatePhotoOfIndex(realEstateId, 0);
        console.log(realEstatePhoto1);
        let realEstatePhoto2 = await instance.getRealEstatePhotoOfIndex(realEstateId, 1);
        assert(realEstatePhoto1.cid === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe1");
        assert(realEstatePhoto1.description === "Reconstruction1");
        assert(realEstatePhoto2.cid === "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe2");
        assert(realEstatePhoto2.description === "Reconstruction2");
    });

});



