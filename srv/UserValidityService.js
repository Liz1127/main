const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { UserValidity } = this.entities;

    this.after('READ', 'UserValidityWithApproval', each => {
        const currentDate = new Date();
        const endDate = new Date(each.endDate);
        const oneWeekBeforeEndDate = new Date(endDate);
        const threeDaysBeforeEndDate = new Date(endDate);
        const oneDayBeforeEndDate = new Date(endDate);

        oneWeekBeforeEndDate.setDate(endDate.getDate() - 7);
        threeDaysBeforeEndDate.setDate(endDate.getDate() - 3);
        oneDayBeforeEndDate.setDate(endDate.getDate() - 1);

        if (currentDate >= oneWeekBeforeEndDate && currentDate < threeDaysBeforeEndDate) {
            each.status = "1 week to go";
        } else if (currentDate >= threeDaysBeforeEndDate && currentDate < oneDayBeforeEndDate) {
            each.status = "3 days to go";
        } else if (currentDate >= oneDayBeforeEndDate && currentDate < endDate) {
            each.status = "1 day to go";
        } else if (currentDate >= endDate) {
            each.status = "Expired";
        } else {
            each.status = "On time";
        }
    });

    this.on('updateAssignment', async (req) => {
        const { userID, assignment } = req.data;
        const affectedRows = await cds.run(
            UPDATE('user.UserValidity')
            .set({ assignment })
            .where({ userID })
        );

        return affectedRows > 0;
    });
});