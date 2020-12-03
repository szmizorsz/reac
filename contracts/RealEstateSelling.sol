pragma solidity ^0.6.2;

contract RealEstateSelling {
    enum STATE {REGISTERED, CONFIRMED, SUCCESSFULL, WITHDRAWN}

    uint256 public contractId;
    uint256 public realEstateId;
    address public seller;
    address public buyer;
    uint256 public price;
    uint256 public dueDate;
    uint256 public paid;
    STATE public state;

    event SellingContractConfirmation(uint256 contractId, uint256 realEstateId);

    event SellingContractCompletion(uint256 contractId, uint256 realEstateId);

    event SellingContractWithdraw(uint256 contractId, uint256 realEstateId);

    constructor(
        uint256 _contractId,
        uint256 _realEstateId,
        address _seller,
        address _buyer,
        uint256 _price,
        uint256 _dueDate
    ) public {
        contractId = _contractId;
        realEstateId = _realEstateId;
        seller = _seller;
        buyer = _buyer;
        price = _price;
        dueDate = _dueDate;
        state = STATE.REGISTERED;
    }

    function confirm() public {
        require(
            msg.sender == buyer && state == STATE.REGISTERED,
            "msg.sender is not the buyer or the contract is already confirmed"
        );
        state = STATE.CONFIRMED;
        emit SellingContractConfirmation(contractId, realEstateId);
    }

    function registerRecievedPayment(uint256 amount) public {
        require(
            msg.sender == seller && state == STATE.CONFIRMED,
            "msg.sender is not the seller or the contract is not in confirmed state"
        );
        paid += amount;
        if (paid >= price) {
            state = STATE.SUCCESSFULL;
            emit SellingContractCompletion(contractId, realEstateId);
        }
    }

    function withdraw() public {
        require(
            msg.sender == seller &&
                (state == STATE.REGISTERED || state == STATE.CONFIRMED) &&
                paid == 0,
            "msg.sender is not the seller or the contract is not in registered or in confirmed state or the contract already got paid"
        );
        state = STATE.WITHDRAWN;
        emit SellingContractWithdraw(contractId, realEstateId);
    }
}
