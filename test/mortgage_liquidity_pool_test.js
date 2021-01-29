const ReacAccessControl = artifacts.require("ReacAccessControl");
const RealEstateRepository = artifacts.require("RealEstateRepository");
const MortgageLiquidityPool = artifacts.require("MortgageLiquidityPool");
const Mortgage = artifacts.require("Mortgage");
const { AssessmentRounded } = require("@material-ui/icons");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.BN;

contract("MortgageLiquidityPool", async function (accounts) {
    let instance;
    let realEstateRepositoryInstance;
    let interestRate = 100;
    const realEstateRegister = accounts[2];
    const mortgageApprover = accounts[3];
    const notMortgageApprover = accounts[4];
    let reacAccessControlInstance;

    beforeEach(async function () {
        reacAccessControlInstance = await ReacAccessControl.new();
        const realEstateRegisterRole = await reacAccessControlInstance.getRealEstateRegisterRole();
        await reacAccessControlInstance.grantRole(realEstateRegisterRole, realEstateRegister);
        const mortgageApproverRole = await reacAccessControlInstance.getMortgageApproverRole();
        await reacAccessControlInstance.grantRole(mortgageApproverRole, mortgageApprover);
        realEstateRepositoryInstance = await RealEstateRepository.new(reacAccessControlInstance.address);
        instance = await MortgageLiquidityPool.new(realEstateRepositoryInstance.address, reacAccessControlInstance.address);
        await instance.setInterestRate(interestRate);
    });

    afterEach(async function () {
        await realEstateRepositoryInstance.destroy();
        await instance.destroy();
    });

    it("should inject liquidity into liquidity pool", async function () {
        let provider = accounts[1];
        let amount = 10;
        let result = await instance.injectLiquidity({ from: provider, value: amount });
        truffleAssert.eventEmitted(result, 'LiquidityInjection');
        truffleAssert.eventEmitted(result, 'LiquidityInjection', (e) => {
            return e.amount.toNumber() === 10
                && e.provider === accounts[1];
        }, 'event params incorrect');
        let capital = await instance.capital();
        assert(capital.toNumber() === amount);
        let availableCapital = await instance.availableCapital();
        assert(availableCapital.toNumber() === amount);
        let providerBalance = await instance.getProviderBalance(provider);
        assert(providerBalance._capital.toNumber() == amount);
        assert(providerBalance._collectedInterest.toNumber() == 0);
    });

    it("should get liquidity provider by index", async function () {
        let provider1 = accounts[1];
        let amount1 = 10;
        await instance.injectLiquidity({ from: provider1, value: amount1 });
        let provider2 = accounts[2];
        let amount2 = 20;
        await instance.injectLiquidity({ from: provider2, value: amount2 });

        let provider2Balance = await instance.getProviderByIndex(1);
        assert(provider2Balance._provider == provider2);
        assert(provider2Balance._capital.toNumber() == amount2);
        assert(provider2Balance._collectedInterest.toNumber() == 0);
    });

    it("should apply for mortgage", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });
        let realEstateId = 1;
        let amount = 200;
        let result = await instance.applyForMortgage(realEstateId, amount);
        truffleAssert.eventEmitted(result, 'MortgageApplication');
        truffleAssert.eventEmitted(result, 'MortgageApplication', (e) => {
            return e.mortgageId.toNumber() === 1
                && e.realEstateId.toNumber() === realEstateId
                && e.applicant === proprietor
                && e.amount.toNumber() === amount;
        }, 'event params incorrect');
    });

    it("should reject the mortgage application if not the current owner sends it", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });
        let realEstateId = 1;
        let amount = 200;
        await truffleAssert.reverts(
            instance.applyForMortgage(realEstateId, amount, { from: accounts[1] }),
            "msg.sender is not the proprietor");
    });

    it("should get mortgage data", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });
        let realEstateId = 1;
        let amount = 200;
        await instance.applyForMortgage(realEstateId, amount);
        let mortgageAddress = await instance.getMortgageByIndex(0);
        let mortgageInstance = await Mortgage.at(mortgageAddress);
        let mortgage = await mortgageInstance.getMortgage();
        assert(mortgage._mortgageId.toNumber() === 1);
        assert(mortgage._realEstateId.toNumber() === realEstateId);
        assert(mortgage._realEstateOwner === proprietor);
        assert(mortgage._requestedAmount.toNumber() === amount);
        assert(mortgage._interestRate.toNumber() === 0);
        assert(mortgage._borrowedAmount.toNumber() === 0);
        assert(mortgage._interest.toNumber() === 0);
        assert(mortgage._repaidAmount.toNumber() === 0);
        assert(mortgage._state.toNumber() === 0);
        assert(mortgage._dueDate.toNumber() === 0);
    });

    it("should get mortgage data by real estate", async function () {
        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });
        let realEstateId = 1;
        let amount = 200;
        await instance.applyForMortgage(realEstateId, amount);
        let mortgageAddress = await instance.getMortgageByRealEstateIdAndIndex(realEstateId, 0);
        let mortgageInstance = await Mortgage.at(mortgageAddress);
        let mortgage = await mortgageInstance.getMortgage();
        assert(mortgage._mortgageId.toNumber() === 1);
        assert(mortgage._realEstateId.toNumber() === realEstateId);
        assert(mortgage._realEstateOwner === proprietor);
        assert(mortgage._requestedAmount.toNumber() === amount);
        assert(mortgage._interestRate.toNumber() === 0);
        assert(mortgage._borrowedAmount.toNumber() === 0);
        assert(mortgage._interest.toNumber() === 0);
        assert(mortgage._repaidAmount.toNumber() === 0);
        assert(mortgage._state.toNumber() === 0);
        assert(mortgage._dueDate.toNumber() === 0);
    });

    it("should approve mortgage", async function () {
        let provider = accounts[1];
        let providedLiquidity = 1000;
        await instance.injectLiquidity({ from: provider, value: providedLiquidity });

        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let requestedAmount = 200;
        await instance.applyForMortgage(realEstateId, requestedAmount);

        let approvedAmount = 150;
        let dueDate = 3000;
        let mortgageAddress = await instance.getMortgageByRealEstateIdAndIndex(realEstateId, 0);
        let mortgageInstance = await Mortgage.at(mortgageAddress);
        let result = await mortgageInstance.approve(approvedAmount, dueDate, { from: mortgageApprover });

        truffleAssert.eventEmitted(result, 'MortgageApproval');
        truffleAssert.eventEmitted(result, 'MortgageApproval', (e) => {
            return e.mortgageId.toNumber() === 1
                && e.realEstateId.toNumber() === realEstateId
                && e.realEstateOwner === proprietor
                && e.borrowedAmount.toNumber() === approvedAmount
                && e.interestRate.toNumber() === interestRate
                && e.interest.toNumber() === 15
                && e.dueDate.toNumber() === dueDate;
        }, 'event params incorrect');
        let mortgage = await mortgageInstance.getMortgage();
        assert(mortgage._requestedAmount.toNumber() === requestedAmount);
        assert(mortgage._interestRate.toNumber() === interestRate);
        assert(mortgage._borrowedAmount.toNumber() === approvedAmount);
        assert(mortgage._interest.toNumber() === 15);
        assert(mortgage._repaidAmount.toNumber() === 0);
        assert(mortgage._dueDate.toNumber() === dueDate);
        assert(mortgage._state.toNumber() === 1);

        let availableCapital = await instance.availableCapital();
        assert(availableCapital.toNumber() === 850);
        let lentCapital = await instance.lentCapital();
        assert(lentCapital.toNumber() === 150);
        let collectibleInterest = await instance.collectibleInterest();
        assert(collectibleInterest.toNumber() === 15);
    });

    it("should reject mortgage", async function () {
        let provider = accounts[1];
        let providedLiquidity = 1000;
        await instance.injectLiquidity({ from: provider, value: providedLiquidity });

        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let requestedAmount = 200;
        await instance.applyForMortgage(realEstateId, requestedAmount);

        let mortgageAddress = await instance.getMortgageByRealEstateIdAndIndex(realEstateId, 0);
        let mortgageInstance = await Mortgage.at(mortgageAddress);
        let result = await mortgageInstance.reject({ from: mortgageApprover });

        truffleAssert.eventEmitted(result, 'MortgageRejection');
        truffleAssert.eventEmitted(result, 'MortgageRejection', (e) => {
            return e.mortgageId.toNumber() === 1
                && e.realEstateId.toNumber() === realEstateId
                && e.realEstateOwner === proprietor;
        }, 'event params incorrect');
        let mortgage = await mortgageInstance.getMortgage();
        assert(mortgage._state.toNumber() === 2);
    });

    it("should not approve mortgage if the caller does not have mortgage approver role", async function () {
        let provider = accounts[1];
        let providedLiquidity = 1000;
        await instance.injectLiquidity({ from: provider, value: providedLiquidity });

        let proprietor = accounts[0];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let requestedAmount = 200;
        await instance.applyForMortgage(realEstateId, requestedAmount);

        let mortgageAddress = await instance.getMortgageByRealEstateIdAndIndex(realEstateId, 0);
        let mortgageInstance = await Mortgage.at(mortgageAddress);

        let approvedAmount = 150;
        let dueDate = 3000;

        await truffleAssert.reverts(
            mortgageInstance.approve(approvedAmount, dueDate, { from: notMortgageApprover }),
            "Caller does not have mortgage approver role");
    });

    it("should repay mortgage with capital first", async function () {
        let provider1 = accounts[0];
        let providedLiquidity1 = 1000;
        await instance.injectLiquidity({ from: provider1, value: providedLiquidity1 });

        let provider2 = accounts[1];
        let providedLiquidity2 = 2000;
        await instance.injectLiquidity({ from: provider2, value: providedLiquidity2 });

        let proprietor = accounts[2];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let requestedAmount = 300;
        await instance.applyForMortgage(realEstateId, requestedAmount, { from: proprietor });

        let approvedAmount = 300;
        let dueDate = 3000;
        let mortgageAddress = await instance.getMortgageByRealEstateIdAndIndex(realEstateId, 0);
        let mortgageInstance = await Mortgage.at(mortgageAddress);
        await mortgageInstance.approve(approvedAmount, dueDate, { from: mortgageApprover });

        //Before repayment
        let availableCapital = await instance.availableCapital();
        assert(availableCapital.toNumber() === providedLiquidity1 + providedLiquidity2 - approvedAmount);
        let lentCapital = await instance.lentCapital();
        assert(lentCapital.toNumber() === approvedAmount);
        let collectibleInterest = await instance.collectibleInterest();
        assert(collectibleInterest.toNumber() === 30);
        let collectedInterest = await instance.collectedInterest();
        assert(collectedInterest.toNumber() === 0);

        // Repay
        let repaidAmount = 30;
        let result = await mortgageInstance.repay({ from: proprietor, value: repaidAmount });

        truffleAssert.eventEmitted(result, 'MortgageRepayment');
        truffleAssert.eventEmitted(result, 'MortgageRepayment', (e) => {
            return e.mortgageId.toNumber() === 1
                && e.realEstateId.toNumber() === realEstateId
                && e.realEstateOwner === proprietor
                && e.borrowedAmount.toNumber() === approvedAmount
                && e.interestRate.toNumber() === interestRate
                && e.interest.toNumber() === 30
                && e.repaidAmount.toNumber() === repaidAmount
                && e.dueDate.toNumber() === dueDate;
        }, 'event params incorrect');
        let mortgage = await mortgageInstance.getMortgage();
        assert(mortgage._requestedAmount.toNumber() === requestedAmount);
        assert(mortgage._interestRate.toNumber() === interestRate);
        assert(mortgage._borrowedAmount.toNumber() === approvedAmount);
        assert(mortgage._interest.toNumber() === 30);
        assert(mortgage._repaidAmount.toNumber() === repaidAmount);
        assert(mortgage._dueDate.toNumber() === dueDate);
        assert(mortgage._state.toNumber() === 1);

        //After repayment
        let availableCapitalAfter = await instance.availableCapital();
        assert(availableCapitalAfter.toNumber() === providedLiquidity1 + providedLiquidity2 - approvedAmount + repaidAmount);
        let lentCapitalAfter = await instance.lentCapital();
        assert(lentCapitalAfter.toNumber() === approvedAmount - repaidAmount);
        let collectibleInterestAfter = await instance.collectibleInterest();
        assert(collectibleInterestAfter.toNumber() === 30);
        let collectedInterestAfter = await instance.collectedInterest();
        assert(collectedInterestAfter.toNumber() === 0);

        let provider1Balance = await instance.getProviderBalance(provider1);
        assert(provider1Balance._capital.toNumber() === providedLiquidity1);
        assert(provider1Balance._collectedInterest.toNumber() === 0);
        let provider2Balance = await instance.getProviderBalance(provider2);
        assert(provider2Balance._capital.toNumber() === providedLiquidity2);
        assert(provider2Balance._collectedInterest.toNumber() === 0);
    });

    it("should repay mortgage with interest included", async function () {
        let provider1 = accounts[0];
        let providedLiquidity1 = 1000;
        await instance.injectLiquidity({ from: provider1, value: providedLiquidity1 });

        let provider2 = accounts[1];
        let providedLiquidity2 = 3000;
        await instance.injectLiquidity({ from: provider2, value: providedLiquidity2 });

        let proprietor = accounts[2];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let requestedAmount = 400;
        await instance.applyForMortgage(realEstateId, requestedAmount, { from: proprietor });

        let approvedAmount = 400;
        let dueDate = 3000;
        let mortgageAddress = await instance.getMortgageByRealEstateIdAndIndex(realEstateId, 0);
        let mortgageInstance = await Mortgage.at(mortgageAddress);
        await mortgageInstance.approve(approvedAmount, dueDate, { from: mortgageApprover });

        //Before repayment
        let availableCapital = await instance.availableCapital();
        assert(availableCapital.toNumber() === providedLiquidity1 + providedLiquidity2 - approvedAmount);
        let lentCapital = await instance.lentCapital();
        assert(lentCapital.toNumber() === approvedAmount);
        let collectibleInterest = await instance.collectibleInterest();
        assert(collectibleInterest.toNumber() === 40);
        let collectedInterest = await instance.collectedInterest();
        assert(collectedInterest.toNumber() === 0);

        // Repay
        let repaidCapital = 400;
        let repaidInterest = 40;
        let repaidAmount = repaidCapital + repaidInterest;
        let result = await mortgageInstance.repay({ from: proprietor, value: repaidAmount });

        truffleAssert.eventEmitted(result, 'MortgageRepayment');
        truffleAssert.eventEmitted(result, 'MortgageRepayment', (e) => {
            return e.mortgageId.toNumber() === 1
                && e.realEstateId.toNumber() === realEstateId
                && e.realEstateOwner === proprietor
                && e.borrowedAmount.toNumber() === approvedAmount
                && e.interestRate.toNumber() === interestRate
                && e.interest.toNumber() === 40
                && e.repaidAmount.toNumber() === repaidAmount
                && e.dueDate.toNumber() === dueDate;
        }, 'event params incorrect');
        let mortgage = await mortgageInstance.getMortgage();
        assert(mortgage._requestedAmount.toNumber() === requestedAmount);
        assert(mortgage._interestRate.toNumber() === interestRate);
        assert(mortgage._borrowedAmount.toNumber() === approvedAmount);
        assert(mortgage._interest.toNumber() === 40);
        assert(mortgage._repaidAmount.toNumber() === repaidAmount);
        assert(mortgage._dueDate.toNumber() === dueDate);
        assert(mortgage._state.toNumber() === 3);

        //After repayment
        let availableCapitalAfter = await instance.availableCapital();
        assert(availableCapitalAfter.toNumber() === providedLiquidity1 + providedLiquidity2 - approvedAmount + repaidCapital);
        let lentCapitalAfter = await instance.lentCapital();
        assert(lentCapitalAfter.toNumber() === approvedAmount - repaidCapital);
        let collectibleInterestAfter = await instance.collectibleInterest();
        assert(collectibleInterestAfter.toNumber() === 0);
        let collectedInterestAfter = await instance.collectedInterest();
        assert(collectedInterestAfter.toNumber() === repaidInterest);

        let provider1Balance = await instance.getProviderBalance(provider1);
        assert(provider1Balance._capital.toNumber() === providedLiquidity1);
        assert(provider1Balance._collectedInterest.toNumber() === 10);
        let provider2Balance = await instance.getProviderBalance(provider2);
        assert(provider2Balance._capital.toNumber() === providedLiquidity2);
        assert(provider2Balance._collectedInterest.toNumber() === 30);
    });

    it("should withdraw the collected interest", async function () {
        let provider1 = accounts[0];
        let providedLiquidity1 = 1000;
        await instance.injectLiquidity({ from: provider1, value: providedLiquidity1 });

        let provider2 = accounts[1];
        let providedLiquidity2 = 3000;
        await instance.injectLiquidity({ from: provider2, value: providedLiquidity2 });

        let proprietor = accounts[2];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let requestedAmount = 400;
        await instance.applyForMortgage(realEstateId, requestedAmount, { from: proprietor });

        let approvedAmount = 400;
        let dueDate = 3000;
        let mortgageAddress = await instance.getMortgageByRealEstateIdAndIndex(realEstateId, 0);
        let mortgageInstance = await Mortgage.at(mortgageAddress);
        await mortgageInstance.approve(approvedAmount, dueDate, { from: mortgageApprover });

        // Repay
        let repaidCapital = 400;
        let repaidInterest = 40;
        let repaidAmount = repaidCapital + repaidInterest;
        await mortgageInstance.repay({ from: proprietor, value: repaidAmount });

        //Before withdraw
        let availableCapitalBefore = await instance.availableCapital();
        assert(availableCapitalBefore.toNumber() === providedLiquidity1 + providedLiquidity2 - approvedAmount + repaidCapital);
        let lentCapitalBefore = await instance.lentCapital();
        assert(lentCapitalBefore.toNumber() === approvedAmount - repaidCapital);
        let collectibleInterestBefore = await instance.collectibleInterest();
        assert(collectibleInterestBefore.toNumber() === 0);
        let collectedInterestBefore = await instance.collectedInterest();
        assert(collectedInterestBefore.toNumber() === repaidInterest);

        // Withdraw
        let withdrawAmount = 10;
        let result = await instance.withdrawLiquidity(withdrawAmount, { from: provider1 });
        truffleAssert.eventEmitted(result, 'LiquidityWithdrawal');
        truffleAssert.eventEmitted(result, 'LiquidityWithdrawal', (e) => {
            return e.provider === provider1
                && e.collectedInterestWithdraw.toNumber() === 10
                && e.capitalWithdraw.toNumber() === 0;
        }, 'event params incorrect');

        let availableCapitalAfter = await instance.availableCapital();
        assert(availableCapitalAfter.toNumber() === availableCapitalBefore.toNumber());
        let lentCapitalAfter = await instance.lentCapital();
        assert(lentCapitalAfter.toNumber() === lentCapitalBefore.toNumber());
        let collectibleInterestAfter = await instance.collectibleInterest();
        assert(collectibleInterestAfter.toNumber() === 0);
        let collectedInterestAfter = await instance.collectedInterest();
        assert(collectedInterestAfter.toNumber() === repaidInterest - withdrawAmount);

        let provider1Balance = await instance.getProviderBalance(provider1);
        assert(provider1Balance._capital.toNumber() === providedLiquidity1);
        assert(provider1Balance._collectedInterest.toNumber() === 0);
    });

    it("should withdraw the collected interest and some capital", async function () {
        let provider1 = accounts[0];
        let providedLiquidity1 = 1000;
        await instance.injectLiquidity({ from: provider1, value: providedLiquidity1 });

        let provider2 = accounts[1];
        let providedLiquidity2 = 3000;
        await instance.injectLiquidity({ from: provider2, value: providedLiquidity2 });

        let proprietor = accounts[2];
        let tokenURI = "QmVB3rL9ZCk8SYvsMRiTERkeU4AYExui2tLZ6iiqEhKAMe";
        await realEstateRepositoryInstance.registerRealEstate(proprietor, tokenURI, { from: realEstateRegister });

        let realEstateId = 1;
        let requestedAmount = 400;
        await instance.applyForMortgage(realEstateId, requestedAmount, { from: proprietor });

        let approvedAmount = 400;
        let dueDate = 3000;
        let mortgageAddress = await instance.getMortgageByRealEstateIdAndIndex(realEstateId, 0);
        let mortgageInstance = await Mortgage.at(mortgageAddress);
        await mortgageInstance.approve(approvedAmount, dueDate, { from: mortgageApprover });

        // Repay
        let repaidCapital = 400;
        let repaidInterest = 40;
        let repaidAmount = repaidCapital + repaidInterest;
        await mortgageInstance.repay({ from: proprietor, value: repaidAmount });

        //Before withdraw
        let availableCapitalBefore = await instance.availableCapital();
        assert(availableCapitalBefore.toNumber() === providedLiquidity1 + providedLiquidity2 - approvedAmount + repaidCapital);
        let lentCapitalBefore = await instance.lentCapital();
        assert(lentCapitalBefore.toNumber() === approvedAmount - repaidCapital);
        let collectibleInterestBefore = await instance.collectibleInterest();
        assert(collectibleInterestBefore.toNumber() === 0);
        let collectedInterestBefore = await instance.collectedInterest();
        assert(collectedInterestBefore.toNumber() === repaidInterest);

        // Withdraw
        let withdrawCollectedInterestPart = 10;
        let withdrawCapitalPart = 100;
        let withdrawAmount = withdrawCollectedInterestPart + withdrawCapitalPart;
        let result = await instance.withdrawLiquidity(withdrawAmount, { from: provider1 });
        truffleAssert.eventEmitted(result, 'LiquidityWithdrawal');
        truffleAssert.eventEmitted(result, 'LiquidityWithdrawal', (e) => {
            return e.provider === provider1
                && e.collectedInterestWithdraw.toNumber() === withdrawCollectedInterestPart
                && e.capitalWithdraw.toNumber() === withdrawCapitalPart;
        }, 'event params incorrect');

        let availableCapitalAfter = await instance.availableCapital();
        assert(availableCapitalAfter.toNumber() === availableCapitalBefore.toNumber() - withdrawCapitalPart);
        let lentCapitalAfter = await instance.lentCapital();
        assert(lentCapitalAfter.toNumber() === lentCapitalBefore.toNumber());
        let collectibleInterestAfter = await instance.collectibleInterest();
        assert(collectibleInterestAfter.toNumber() === 0);
        let collectedInterestAfter = await instance.collectedInterest();
        assert(collectedInterestAfter.toNumber() === repaidInterest - withdrawCollectedInterestPart);

        let provider1Balance = await instance.getProviderBalance(provider1);
        assert(provider1Balance._capital.toNumber() === providedLiquidity1 - withdrawCapitalPart);
        assert(provider1Balance._collectedInterest.toNumber() === 0);
    });

});
