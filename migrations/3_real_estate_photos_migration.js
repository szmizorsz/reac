const RealEstatePhotos = artifacts.require("RealEstatePhotos");

module.exports = function (deployer) {
    deployer.deploy(RealEstatePhotos);
};
