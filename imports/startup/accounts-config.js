import { Accounts } from 'meteor/accounts-base';
import { AccountsTemplates } from 'meteor/useraccounts:core';

AccountsTemplates.addField({
    _id: "phone",
    type: "tel",
    displayName: "Mobile number",
    required: true,
    minLength: 1,
});
 
AccountsTemplates.addField({
    _id: "number",
    type: "text",
    displayName: "Number Plate",
    required: true,
    minLength: 1,
});

