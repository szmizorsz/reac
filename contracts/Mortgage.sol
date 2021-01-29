pragma solidity >=0.4.22 <0.8.0;

import "./MortgageLiquidityPool.sol";
import "./ReacAccessControl.sol";

contract Mortgage {
    enum STATE {REQUESTED, APPROVED, REJECTED, REPAID}

    uint256 public mortgageId;
    uint256 public realEstateId;
    address payable public realEstateOwner;
    uint256 public requestedAmount;
    uint256 public interestRate;
    uint256 public borrowedAmount;
    uint256 public interest;
    uint256 public repaidAmount;
    STATE public state;
    uint256 public dueDate;
    MortgageLiquidityPool mortgageLiquidityPool;
    ReacAccessControl reacAccessControl;

    event MortgageApproval(
        uint256 mortgageId,
        uint256 realEstateId,
        address realEstateOwner,
        uint256 borrowedAmount,
        uint256 interestRate,
        uint256 interest,
        uint256 dueDate
    );

    event MortgageRejection(
        uint256 mortgageId,
        uint256 realEstateId,
        address realEstateOwner
    );

    event MortgageRepayment(
        uint256 mortgageId,
        uint256 realEstateId,
        address realEstateOwner,
        uint256 borrowedAmount,
        uint256 repaidAmount,
        uint256 interestRate,
        uint256 interest,
        uint256 dueDate
    );

    constructor(
        address _mortgageLiquidityPool,
        address _reacAccessControl,
        uint256 _mortgageId,
        uint256 _realEstateId,
        address payable _realEstateOwner,
        uint256 _requestedAmount
    ) public {
        mortgageLiquidityPool = MortgageLiquidityPool(_mortgageLiquidityPool);
        reacAccessControl = ReacAccessControl(_reacAccessControl);
        mortgageId = _mortgageId;
        realEstateId = _realEstateId;
        realEstateOwner = _realEstateOwner;
        requestedAmount = _requestedAmount;
        state = STATE.REQUESTED;
    }

    function getMortgage()
        public
        view
        returns (
            uint256 _mortgageId,
            uint256 _realEstateId,
            address _realEstateOwner,
            uint256 _requestedAmount,
            uint256 _interestRate,
            uint256 _borrowedAmount,
            uint256 _interest,
            uint256 _repaidAmount,
            STATE _state,
            uint256 _dueDate
        )
    {
        return (
            mortgageId,
            realEstateId,
            realEstateOwner,
            requestedAmount,
            interestRate,
            borrowedAmount,
            interest,
            repaidAmount,
            state,
            dueDate
        );
    }

    function approve(uint256 _amount, uint256 _dueDate) public {
        require(
            reacAccessControl.hasRole(
                reacAccessControl.getMortgageApproverRole(),
                msg.sender
            ),
            "Caller does not have mortgage approver role"
        );
        require(state == STATE.REQUESTED, "mortgage is not in requested state");
        require(
            _amount <= mortgageLiquidityPool.availableCapital(),
            "The approved amount is greater than the available amount in the mortgage liquidity pool"
        );
        interestRate = mortgageLiquidityPool.interestRate();
        borrowedAmount = _amount;
        interest = (borrowedAmount * interestRate) / 1000;
        dueDate = _dueDate;
        state = STATE.APPROVED;
        mortgageLiquidityPool.onMortgageApproval(address(this));
        emit MortgageApproval(
            mortgageId,
            realEstateId,
            realEstateOwner,
            borrowedAmount,
            interestRate,
            interest,
            dueDate
        );
    }

    function reject() public {
        require(
            reacAccessControl.hasRole(
                reacAccessControl.getMortgageApproverRole(),
                msg.sender
            ),
            "Caller does not have mortgage approver role"
        );
        require(state == STATE.REQUESTED, "mortgage is not in requested state");
        state = STATE.REJECTED;
        emit MortgageRejection(mortgageId, realEstateId, realEstateOwner);
    }

    function repay() public payable {
        require(state == STATE.APPROVED, "mortgage is not in approved state");
        require(
            realEstateOwner == msg.sender,
            "the real estate owner has to repay the mortgage"
        );
        require(
            repaidAmount + msg.value <= borrowedAmount + interest,
            "the sent amount would overpay the borrowed amount + interest"
        );
        uint256 previouslyRepaidAmount = repaidAmount;
        repaidAmount += msg.value;
        if (repaidAmount >= borrowedAmount + interest) {
            state = STATE.REPAID;
        }
        uint256 repaidCapital;
        uint256 repaidInterest;
        // Repayment first goes to capital, and the remainig to interest
        if (repaidAmount <= borrowedAmount) {
            repaidCapital = msg.value;
        } else if (previouslyRepaidAmount <= borrowedAmount) {
            repaidCapital = borrowedAmount - previouslyRepaidAmount;
            repaidInterest = msg.value - repaidCapital;
        } else {
            repaidInterest = msg.value;
        }
        // Repayment goes to the liquidity pool where the interest is redistributed amoung providers
        mortgageLiquidityPool.onMortgageRepayment{value: msg.value}(
            address(this),
            repaidCapital,
            repaidInterest
        );
        emit MortgageRepayment(
            mortgageId,
            realEstateId,
            realEstateOwner,
            borrowedAmount,
            repaidAmount,
            interestRate,
            interest,
            dueDate
        );
    }
}
