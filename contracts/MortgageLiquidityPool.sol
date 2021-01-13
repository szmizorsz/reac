pragma solidity >=0.4.22 <0.8.0;

import "./Mortgage.sol";
import "./RealEstateRepository.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MortgageLiquidityPool is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _ids;

    RealEstateRepository realEstateRepository;

    uint256 public capital;
    uint256 public collectibleInterest;
    uint256 public collectedInterest;
    // interest rate is stored as 1000 * percent, e.g.: 0.2 = 20% is stored as 200
    // it is a representation of shifting the decimal point by 3 because of floating number uncapavilities in soldity
    uint256 public interestRate;
    uint256 public lentCapital;
    uint256 public availableCapital;
    address[] liquidityProviders;

    struct ProviderBalance {
        uint256 capital;
        uint256 collectedInterest;
    }
    mapping(address => ProviderBalance) balances;
    mapping(uint256 => Mortgage[]) mortgagesByRealEstateId;

    event LiquidityInjection(address provider, uint256 amount);
    event LiquidityWithdrawal(
        address provider,
        uint256 collectedInterestWithdraw,
        uint256 capitalWithdraw
    );
    event MortgageApplication(
        uint256 mortgageId,
        uint256 realEstateId,
        address applicant,
        uint256 amount
    );

    constructor(address _realEstateRepository) public {
        realEstateRepository = RealEstateRepository(_realEstateRepository);
    }

    function setInterestRate(uint256 _interestRate) public onlyOwner {
        interestRate = _interestRate;
    }

    function injectLiquidity() public payable {
        bool senderAlreadyProvided;
        for (uint256 i = 0; i < liquidityProviders.length; i++) {
            if (liquidityProviders[i] == msg.sender) {
                senderAlreadyProvided = true;
                break;
            }
        }
        if (!senderAlreadyProvided) {
            liquidityProviders.push(msg.sender);
            ProviderBalance memory providerBalance;
            providerBalance.capital = msg.value;
            balances[msg.sender] = providerBalance;
        } else {
            balances[msg.sender].capital += msg.value;
        }
        capital += msg.value;
        availableCapital += msg.value;
        emit LiquidityInjection(msg.sender, msg.value);
    }

    function withdrawLiquidity(uint256 amount) public {
        require(
            availableCapital + balances[msg.sender].collectedInterest >= amount
        );
        uint256 providerBalance =
            balances[msg.sender].capital +
                balances[msg.sender].collectedInterest;
        require(providerBalance >= amount);
        uint256 capitalWithdraw;
        uint256 collectedInterestWithdraw;
        // withdraw the collected interest first
        if (amount <= balances[msg.sender].collectedInterest) {
            collectedInterestWithdraw = amount;
            balances[msg.sender].collectedInterest -= collectedInterestWithdraw;
        } else {
            capitalWithdraw = amount - balances[msg.sender].collectedInterest;
            collectedInterestWithdraw = balances[msg.sender].collectedInterest;
            balances[msg.sender].collectedInterest = 0;
            balances[msg.sender].capital -= capitalWithdraw;
        }
        capital -= capitalWithdraw;
        availableCapital -= capitalWithdraw;
        collectedInterest -= collectedInterestWithdraw;
        msg.sender.transfer(amount);
        emit LiquidityWithdrawal(
            msg.sender,
            collectedInterestWithdraw,
            capitalWithdraw
        );
    }

    function getNrOfLiquidityProviders() public view returns (uint256) {
        return liquidityProviders.length;
    }

    function getProviderBalance(address provider)
        public
        view
        returns (uint256 _capital, uint256 _collectedInterest)
    {
        return (
            balances[provider].capital,
            balances[provider].collectedInterest
        );
    }

    function applyForMortgage(uint256 realEstateId, uint256 amount) public {
        require(
            msg.sender == realEstateRepository.ownerOf(realEstateId),
            "msg.sender is not the proprietor"
        );
        _ids.increment();
        uint256 mortgageId = _ids.current();
        Mortgage mortgage =
            new Mortgage(
                address(this),
                mortgageId,
                realEstateId,
                msg.sender,
                amount
            );
        mortgagesByRealEstateId[realEstateId].push(mortgage);
        emit MortgageApplication(mortgageId, realEstateId, msg.sender, amount);
    }

    function getNrOfMortgagesByRealEstateId(uint256 realEstateId)
        public
        view
        returns (uint256)
    {
        return mortgagesByRealEstateId[realEstateId].length;
    }

    function getMortgageByRealEstateIdAndIndex(
        uint256 realEstateId,
        uint256 index
    ) public view returns (Mortgage) {
        return mortgagesByRealEstateId[realEstateId][index];
    }

    function onMortgageApproval(address mortgageAddress) public {
        Mortgage mortgage = Mortgage(mortgageAddress);
        require(
            msg.sender == mortgageAddress,
            "Only the mortgage contract can claim that it is approved"
        );
        require(
            mortgage.borrowedAmount() <= availableCapital,
            "The approved amount is greater than the available amount in the mortgage liquidity pool"
        );
        uint256 borrowedAmount = mortgage.borrowedAmount();
        availableCapital -= borrowedAmount;
        lentCapital += borrowedAmount;
        collectibleInterest += mortgage.interest();
        mortgage.realEstateOwner().transfer(borrowedAmount);
    }

    function onMortgageRepayment(
        address mortgageAddress,
        uint256 repaidCapital,
        uint256 repaidInterest
    ) public payable {
        require(
            msg.sender == mortgageAddress,
            "Only the mortgage contract initiate a repayment"
        );
        lentCapital -= repaidCapital;
        availableCapital += repaidCapital;
        collectedInterest += repaidInterest;
        collectibleInterest -= repaidInterest;
        // redistibution of repaid interest amoung liquidity providers
        for (uint256 i = 0; i < liquidityProviders.length; i++) {
            address providerAddress = liquidityProviders[i];
            uint256 providerCapital = balances[providerAddress].capital;
            uint256 providerPercent = percent(providerCapital, capital, 3);
            uint256 repaidInterestForProvider =
                (repaidInterest * providerPercent) / 1000;
            balances[providerAddress]
                .collectedInterest += repaidInterestForProvider;
        }
    }

    function percent(
        uint256 numerator,
        uint256 denominator,
        uint256 precision
    ) public pure returns (uint256 quotient) {
        // caution, check safe-to-multiply here
        uint256 _numerator = numerator * 10**(precision + 1);
        // with rounding of last digit
        uint256 _quotient = ((_numerator / denominator) + 5) / 10;
        return (_quotient);
    }

    function destroy() external onlyOwner {
        require(msg.sender == owner());
        selfdestruct(msg.sender);
    }
}
