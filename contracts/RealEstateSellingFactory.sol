pragma solidity ^0.6.2;

import "./RealEstateRepository.sol";
import "./RealEstateSelling.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateSellingFactory is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _ids;

    RealEstateRepository realEstateRepository;

    mapping(uint256 => RealEstateSelling[]) sellingContractsByRealEstateId;

    event RealEstateSellingRegistration(
        uint256 contractId,
        uint256 realEstateId,
        address seller,
        address buyer,
        uint256 price,
        uint256 dueDate
    );

    constructor(address _realEstateRepository) public {
        realEstateRepository = RealEstateRepository(_realEstateRepository);
    }

    function registerSellingContract(
        uint256 realEstateId,
        address buyer,
        uint256 price,
        uint256 dueDate
    ) public {
        require(
            msg.sender == realEstateRepository.ownerOf(realEstateId),
            "msg.sender is not the proprietor"
        );
        _ids.increment();
        uint256 contractId = _ids.current();
        RealEstateSelling sellingContract = new RealEstateSelling(
            contractId,
            realEstateId,
            msg.sender,
            buyer,
            price,
            dueDate
        );
        sellingContractsByRealEstateId[realEstateId].push(sellingContract);
        emit RealEstateSellingRegistration(
            contractId,
            realEstateId,
            msg.sender,
            buyer,
            price,
            dueDate
        );
    }

    function getNrOfSellingContractsByTokenId(uint256 realEstateId)
        public
        view
        returns (uint256)
    {
        return sellingContractsByRealEstateId[realEstateId].length;
    }

    function getSellingContractByRealEstateIdAndIndex(
        uint256 realEstateId,
        uint256 index
    ) public view returns (RealEstateSelling) {
        return sellingContractsByRealEstateId[realEstateId][index];
    }

    function destroy() external onlyOwner {
        require(msg.sender == owner());
        selfdestruct(msg.sender);
    }
}
