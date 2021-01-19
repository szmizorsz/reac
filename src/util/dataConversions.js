export const sellingContractIntegerStateToString = (stateInt) => {
    switch (stateInt) {
        case 0:
            return 'Registered';
        case 1:
            return 'Confirmed';
        case 2:
            return 'Successfull';
        case 3:
            return 'Withdrawn';
        default:
            throw new Error("Not expected: " + stateInt + " int as state from chain");
    }
}

export const mortgageIntegerStateToString = (stateInt) => {
    switch (stateInt) {
        case 0:
            return 'Requested';
        case 1:
            return 'Approved';
        case 2:
            return 'Rejected';
        case 3:
            return 'Repaid';
        default:
            throw new Error("Not expected: " + stateInt + " int as state from chain");
    }
}
