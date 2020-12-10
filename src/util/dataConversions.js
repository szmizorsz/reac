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
            throw "Not expected: " + stateInt + " int as state from chain"
    }

}