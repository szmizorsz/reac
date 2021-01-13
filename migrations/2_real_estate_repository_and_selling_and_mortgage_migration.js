const RealEstateRepository = artifacts.require("RealEstateRepository");
const StringUtils = artifacts.require("StringUtils");
const RealEstateSellingFactory = artifacts.require("RealEstateSellingFactory");
const MortgageLiquidityPool = artifacts.require("MortgageLiquidityPool");

module.exports = async function (deployer) {
	deployer.deploy(StringUtils);
	deployer.link(StringUtils, [RealEstateRepository]);
	deployer.deploy(RealEstateRepository).then(function () {
		deployer.deploy(MortgageLiquidityPool, RealEstateRepository.address);
		deployer.deploy(RealEstateSellingFactory, RealEstateRepository.address);
	});
};
