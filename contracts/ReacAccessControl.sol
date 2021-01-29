pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ReacAccessControl is AccessControl {
    bytes32 public constant REAL_ESTATE_REGISTER_ROLE =
        keccak256("REAL_ESTATE_REGISTER_ROLE");
    bytes32 public constant MORTGAGE_APPROVER_ROLE =
        keccak256("MORTGAGE_APPROVER_ROLE");

    constructor() public {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function getRealEstateRegisterRole() public pure returns (bytes32) {
        return REAL_ESTATE_REGISTER_ROLE;
    }

    function getMortgageApproverRole() public pure returns (bytes32) {
        return MORTGAGE_APPROVER_ROLE;
    }
}
