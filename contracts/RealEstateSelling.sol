pragma solidity >=0.4.22 <0.8.0;

import "./RealEstateRepository.sol";

contract RealEstateSelling {
    enum STATE {REGISTERED, CONFIRMED, SUCCESSFULL, WITHDRAWN}

    uint256 contractId;
    uint256 realEstateId;
    address payable seller;
    address buyer;
    uint256 price;
    uint256 dueDate;
    uint256 paid;
    STATE state;
    RealEstateRepository realEstateRepository;

    event SellingContractConfirmation(uint256 contractId, uint256 realEstateId);

    event SellingContractCompletion(uint256 contractId, uint256 realEstateId);

    event SellingContractWithdraw(uint256 contractId, uint256 realEstateId);

    constructor(
        uint256 _contractId,
        uint256 _realEstateId,
        address payable _seller,
        address _buyer,
        uint256 _price,
        uint256 _dueDate,
        address _realEstateRepository
    ) public {
        contractId = _contractId;
        realEstateId = _realEstateId;
        seller = _seller;
        buyer = _buyer;
        price = _price;
        dueDate = _dueDate;
        state = STATE.REGISTERED;
        realEstateRepository = RealEstateRepository(_realEstateRepository);
    }

    function getSellingContract()
        public
        view
        returns (
            uint256 _contractId,
            uint256 _realEstateId,
            address _seller,
            address _buyer,
            uint256 _price,
            uint256 _dueDate,
            uint256 _paid,
            STATE _state
        )
    {
        return (
            contractId,
            realEstateId,
            seller,
            buyer,
            price,
            dueDate,
            paid,
            state
        );
    }

    function confirm() public {
        require(
            msg.sender == buyer && state == STATE.REGISTERED,
            "msg.sender is not the buyer or the contract is already confirmed"
        );
        state = STATE.CONFIRMED;
        emit SellingContractConfirmation(contractId, realEstateId);
    }

    function pay() public payable {
        require(msg.sender == buyer, "msg.sender is not the buyer");
        require(
            state == STATE.CONFIRMED,
            "the contract is not in confirmed state"
        );
        require(
            price >= paid + msg.value,
            "the sent value would overpay the price"
        );
        paid += msg.value;
        if (paid >= price) {
            state = STATE.SUCCESSFULL;
            realEstateRepository.transferFrom(seller, buyer, realEstateId);
            emit SellingContractCompletion(contractId, realEstateId);
        }
        seller.transfer(msg.value);
    }

    function withdraw() public {
        require(msg.sender == seller, "msg.sender is not the seller");
        require(
            state == STATE.REGISTERED || state == STATE.CONFIRMED,
            "the contract is not in registered or in confirmed state"
        );
        require(paid == 0, "the contract already got paid");
        state = STATE.WITHDRAWN;
        emit SellingContractWithdraw(contractId, realEstateId);
    }
}
