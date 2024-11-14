namespace user;

entity UserValidity {
    key userID   : String(10);
    startDate    : Date;
    endDate      : Date;
    status       : String (100)@readonly;
    assignment   : String(100);
}

entity UserApproval {
    key userID       : String(10);
    approver         : String(50);
    levelOfApproval  : String(1);
    mailID           : String(100);
}
