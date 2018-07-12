const DONATIONS_FUND = artifacts.require("DonationsFund");

contract("DonationsFund", accounts => {
    const [firstAccount, secondAccount, thirdAccount] = accounts;

    it('Creating a donations fund should set correct time', async() => {
        let currentBlockTime = await web3.eth.getBlock('latest').timestamp;
        const fund = await DONATIONS_FUND.new(300);

        let expiration = await fund.expires();
        let expectedExpiration = currentBlockTime + 300;

        assertUpToFiveSeconds(expectedExpiration, expiration);

        /**
         * This methods is used to eliminate the differences that might occur from running the code.
         */
        function assertUpToFiveSeconds(expectedExpiration, expiration) {
            let expired = expiration > expectedExpiration - 5 && expiration < expectedExpiration + 5;
            assert.equal(true, expired, "Expiration mismatch!");
        }
    });


});