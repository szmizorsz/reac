pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstatePhotos is Ownable {
    struct RealEstatePhoto {
        string cid;
        string description;
    }

    mapping(uint256 => RealEstatePhoto[]) private photos;

    event RealEstatePhotoRegistration(
        uint256 realEstateId,
        string cid,
        string description
    );

    function registerRealEstatePhoto(
        uint256 realEstateId,
        string memory cid,
        string memory description
    ) public {
        RealEstatePhoto memory realEstatePhoto;
        realEstatePhoto.cid = cid;
        realEstatePhoto.description = description;
        photos[realEstateId].push(realEstatePhoto);
        emit RealEstatePhotoRegistration(realEstateId, cid, description);
    }

    function getNrOfRealEstatePhotos(uint256 realEstateId)
        public
        view
        returns (uint256)
    {
        return photos[realEstateId].length;
    }

    function getRealEstatePhotoOfIndex(uint256 realEstateId, uint256 index)
        public
        view
        returns (string memory cid, string memory description)
    {
        return (
            photos[realEstateId][index].cid,
            photos[realEstateId][index].description
        );
    }

    function destroy() external onlyOwner {
        require(msg.sender == owner());
        selfdestruct(msg.sender);
    }
}
