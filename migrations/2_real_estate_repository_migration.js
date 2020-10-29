const RealEstateRepository = artifacts.require("RealEstateRepository");
const StringUtils = artifacts.require("StringUtils");

module.exports = function(deployer) {
	deployer.deploy(StringUtils);
	deployer.link(StringUtils, [RealEstateRepository]);
	deployer.deploy(RealEstateRepository);
};
