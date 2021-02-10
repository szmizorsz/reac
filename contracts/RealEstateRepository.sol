pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ReacAccessControl.sol";

contract RealEstateRepository is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _ids;
    ReacAccessControl reacAccessControl;

    event RealEstateRegistration(
        uint256 id,
        address proprietor,
        string tokenURI
    );

    constructor(address _reacAccessControl)
        public
        ERC721("Real estate coin", "RESC")
    {
        reacAccessControl = ReacAccessControl(_reacAccessControl);
    }

    function registerRealEstate(address proprietor, string memory tokenURI)
        public
    {
        require(
            reacAccessControl.hasRole(
                reacAccessControl.getRealEstateRegisterRole(),
                msg.sender
            ),
            "Caller does not have real estate register role"
        );
        _ids.increment();
        uint256 newItemId = _ids.current();
        _safeMint(proprietor, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit RealEstateRegistration(newItemId, proprietor, tokenURI);
    }

    function destroy() external onlyOwner {
        require(msg.sender == owner());
        selfdestruct(msg.sender);
    }
}
