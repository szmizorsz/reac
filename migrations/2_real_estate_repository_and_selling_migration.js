const RealEstateRepository = artifacts.require("RealEstateRepository");
const StringUtils = artifacts.require("StringUtils");
const RealEstateSellingFactory = artifacts.require("RealEstateSellingFactory");

module.exports = async function (deployer) {
	deployer.deploy(StringUtils);
	deployer.link(StringUtils, [RealEstateRepository]);
	deployer.deploy(RealEstateRepository).then(function () {
		return deployer.deploy(RealEstateSellingFactory, RealEstateRepository.address);
	});
};
