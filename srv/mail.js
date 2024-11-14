// const { sendMail } = require('@sap-cloud-sdk/mail-client');

// module.exports = srv =>
//   srv.on("sendmail", async (req) => {
//     const mailConfig = {
//       to: 'riya.thomas1@in.ey.com',
//       subject: 'Test On Premise Destination',
//       text: 'If you receive this e-mail, you are successful.'
//     };
//     sendMail({ destinationName: 'mail_destination' }, [mailConfig]);
//   });


  const { sendMail } = require('@sap-cloud-sdk/mail-client');

  module.exports = srv =>
    srv.on("sendmail", async (req) => {
      const { to, subject, text } = req.data;
      const mailConfig = {
        to,
        subject,
        text
      };
      await sendMail({ destinationName: 'mail_destination' }, [mailConfig]);
    });
  
