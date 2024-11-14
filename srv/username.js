const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { User } = this.entities;

    this.on('createUser', async (req) => {
        const { name } = req.data;
        const newUser = await cds.run(
            INSERT.into(User).entries({ name })
        );

        return newUser;
    });
});
