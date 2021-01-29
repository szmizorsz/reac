const ReacAccessControl = artifacts.require("ReacAccessControl");
const RealEstateRepository = artifacts.require("RealEstateRepository");
const StringUtils = artifacts.require("StringUtils");
const RealEstateSellingFactory = artifacts.require("RealEstateSellingFactory");
const MortgageLiquidityPool = artifacts.require("MortgageLiquidityPool");

const realEstateRegister = '0xC0F3b367AF79DEd43dBFd8e7026c1b1Db58D7b87';
const mortgageApprover = '0xA819c28d5964c4038e96A2C29EAe72A5a9E5b420';

module.exports = async (deployer) => {
	await deployer.deploy(ReacAccessControl);
	reacAccessControlInstance = await ReacAccessControl.deployed();
	const realEstateRegisterRole = await reacAccessControlInstance.getRealEstateRegisterRole();
	await reacAccessControlInstance.grantRole(realEstateRegisterRole, realEstateRegister);
	const mortgageApproverRole = await reacAccessControlInstance.getMortgageApproverRole();
	await reacAccessControlInstance.grantRole(mortgageApproverRole, mortgageApprover);

	await deployer.deploy(StringUtils);
	deployer.link(StringUtils, [RealEstateRepository]);
	await deployer.deploy(RealEstateRepository, reacAccessControlInstance.address);
	realEstateRepositoryInstance = await RealEstateRepository.deployed();

	await deployer.deploy(MortgageLiquidityPool, realEstateRepositoryInstance.address, reacAccessControlInstance.address);
	mortgageLiquidityPoolInstance = await MortgageLiquidityPool.deployed();
	await mortgageLiquidityPoolInstance.setInterestRate(100);

	await deployer.deploy(RealEstateSellingFactory, realEstateRepositoryInstance.address);
};