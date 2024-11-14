// using user as my from '../db/user';

// service UserValidityService {
//     entity UserValidity as projection on my.UserValidity;
//     entity UserApproval as projection on my.UserApproval;
// }


using user as my from '../db/user';
service UserValidityService {
    entity UserValidityWithApproval as select from my.UserValidity as uv
    join my.UserApproval as ua on uv.userID = ua.userID {
        key uv.userID,
        uv.startDate,
        uv.endDate,
        uv.status,
        uv.assignment,
        ua.approver,
        ua.levelOfApproval,
        ua.mailID
    };

        action updateAssignment(userID: String, assignment: String) returns Boolean;

}

service MailService {
    action sendmail(to: String, subject: String, text: String);
}

service username {
    entity username as projection on my.user;
}
