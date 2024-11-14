sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Select",
    "sap/ui/core/Item"
], function (Controller, MessageToast, Dialog, Button, Select, Item) {
    "use strict";

    return Controller.extend("my.userapproval.controller.smarttable", {
        onInit: function () {
            var oModel = new sap.ui.model.odata.v2.ODataModel("/odata/v2/user-validity");
            oModel.refreshMetadata();
            this.getView().setModel(oModel);
            this._selectedItem = null; // Initialize the selected item variable

            // Get the SmartTable control
            var oSmartTable = this.byId("smartTable");

            // Get the underlying sap.ui.table.Table control
            var oTable = oSmartTable.getTable();

            // Attach the rowSelectionChange event to the sap.ui.table.Table control
            oTable.attachRowSelectionChange(this.onSelectionChange, this);
        },

        onSelectionChange: function (oEvent) {
            var oTable = oEvent.getSource();
            var iIndex = oTable.getSelectedIndex();
            var oSelectedItem = oTable.getContextByIndex(iIndex);
        
            var oSendEmailButton = this.byId("sendEmailButton");
            var oEditAssignmentButton = this.byId("editAssignmentButton");
        
            if (oSelectedItem) {
                this._selectedItem = oSelectedItem.getObject();
                console.log("Selected Item:", this._selectedItem); // Debugging log
        
                var sStatus = this._selectedItem.status;
                if (sStatus === "1 week to go" || sStatus === "3 days to go" || sStatus === "1 day to go") {
                    oSendEmailButton.setEnabled(true);
                    oEditAssignmentButton.setEnabled(true);
        
                    // Set assignment to "Not Assigned" by default
                    if (!this._selectedItem.assignment || this._selectedItem.assignment !== "Assigned") {
                        this._selectedItem.assignment = "Not Assigned";
                    }
                } else {
                    oSendEmailButton.setEnabled(false);
                    oEditAssignmentButton.setEnabled(false);
                }
            } else {
                this._selectedItem = null;
                oSendEmailButton.setEnabled(false);
                oEditAssignmentButton.setEnabled(false);
                console.log("No item selected"); 
            }
        },
        

        onSendEmail: function () {
            if (!this._selectedItem) {
                MessageToast.show("Please select a user to send an email.");
                return;
            }

            var sMailID = this._selectedItem.mailID;
            var sStatus = this._selectedItem.status;
            var sUserID = this._selectedItem.userID;

            if (!sMailID) {
                MessageToast.show("Mail ID is not available for the selected user.");
                return;
            }

            var sEmailText = `Dear ${sUserID}, You have ${sStatus} before your approval access expires.`;

            var oPayload = {
                to: sMailID,
                subject: 'Approval Access Expiry Notification',
                text: sEmailText
            };

            $.ajax({
                url: "/odata/v4/mail/sendmail",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(oPayload),
                success: function () {
                    MessageToast.show("Email sent to: " + sMailID + "\n(User ID: " + sUserID + ")");
                },
                error: function (err) {
                    MessageToast.show("Failed to send email. Please try again.");
                    console.error("Error sending email:", err);
                }
            });
        },
        onEditAssignment: function () {
            if (!this._selectedItem) {
                MessageToast.show("Please select a user to edit the assignment.");
                return;
            }
        
            var sAssignment = this._selectedItem.assignment;
            if (sAssignment === "Assigned") {
                MessageToast.show("Assignment cannot be edited once it is set to 'Assigned'.");
                return;
            }
        
            var oDialog = new Dialog({
                title: "Edit Assignment",
                content: new Select({
                    items: [
                        new Item({ text: "Assigned", key: "Assigned" }),
                        new Item({ text: "Not Assigned", key: "Not Assigned" })
                    ],
                    selectedKey: sAssignment || "Not Assigned"
                }),
                beginButton: new Button({
                    text: "Save",
                    press: function () {
                        var sNewAssignment = oDialog.getContent()[0].getSelectedKey();
                        this._selectedItem.assignment = sNewAssignment;
        
                        // Call the custom action to update the assignment
                        $.ajax({
                            url: "/odata/v4/user-validity/updateAssignment",
                            method: "POST",
                            contentType: "application/json",
                            data: JSON.stringify({ userID: this._selectedItem.userID, assignment: sNewAssignment }),
                            success: function () {
                                MessageToast.show("Assignment updated successfully.");
                                oDialog.close();
                                // Refresh the table data
                                var oModel = this.getView().getModel();
                                oModel.refresh(true);
                            }.bind(this),
                            error: function (err) {
                                MessageToast.show("Failed to update assignment. Please try again.");
                                console.error("Error updating assignment:", err);
                                console.log("Error details:", err.responseText); // Log error details
                            }
                        });
                    }.bind(this)
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                })
            });
        
            this.getView().addDependent(oDialog);
            oDialog.open();
        }
        
               
    });
});
