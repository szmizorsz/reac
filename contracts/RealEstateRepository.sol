pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StringUtils.sol";  

contract RealEstateRepository is ERC721, Ownable {
    using StringUtils for address;
    using Counters for Counters.Counter;
    Counters.Counter private _ids;

	event RealEstateRegistration(uint id, address proprietor, string tokenURI);

    constructor() public ERC721("Real estate coin", "RESC") {}

    function registerRealEstate(address proprietor, string memory tokenURI) public {
        _ids.increment();
        uint256 newItemId = _ids.current();
        _safeMint(proprietor, newItemId);
        _setTokenURI(newItemId, tokenURI);
		emit RealEstateRegistration(newItemId, proprietor, tokenURI);
    }

    function destroy() external onlyOwner {
        require(msg.sender == owner());
        selfdestruct(msg.sender);   }  
}