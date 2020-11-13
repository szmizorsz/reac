pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstatePhotos is Ownable {
    mapping(uint256 => string[]) private cids;

    event RealEstatePhotoRegistration(uint256 realEstateId, string cid);

    function registerRealEstatePhoto(uint256 realEstateId, string memory cid)
        public
    {
        cids[realEstateId].push(cid);
        emit RealEstatePhotoRegistration(realEstateId, cid);
    }

    function getNrOfRealEstatePhotos(uint256 realEstateId)
        public
        view
        returns (uint256)
    {
        return cids[realEstateId].length;
    }

    function getfRealEstatePhotoCidOfIndex(uint256 realEstateId, uint256 index)
        public
        view
        returns (string memory)
    {
        return cids[realEstateId][index];
    }

    function destroy() external onlyOwner {
        require(msg.sender == owner());
        selfdestruct(msg.sender);
    }
}
