const RealEstateRepository = artifacts.require("RealEstateRepository");
const StringUtils = artifacts.require("StringUtils");
const RealEstateSellingFactory = artifacts.require("RealEstateSellingFactory");
const MortgageLiquidityPool = artifacts.require("MortgageLiquidityPool");

module.exports = async (deployer) => {
	await deployer.deploy(StringUtils);
	deployer.link(StringUtils, [RealEstateRepository]);
	await deployer.deploy(RealEstateRepository);
	realEstateRepositoryInstance = await RealEstateRepository.deployed();
	await deployer.deploy(MortgageLiquidityPool, realEstateRepositoryInstance.address);
	await deployer.deploy(RealEstateSellingFactory, realEstateRepositoryInstance.address);
	mortgageLiquidityPoolInstance = await MortgageLiquidityPool.deployed();
	await mortgageLiquidityPoolInstance.setInterestRate(100);
};