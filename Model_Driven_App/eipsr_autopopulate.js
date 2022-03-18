function setContactEmail(){

    //Get the contact lookup off of the record
    var contact = Xrm.Page.getAttribute('cobalt_contactid').getValue();
    
    //if contact exist, attempt to pull back the entire contact record
    if(contact != null && contact[0].entityType == "contact")
    {
    
    var contactId = contact[0].id;
    var serverUrl;
    
    if (Xrm.Page.context.getClientUrl !== undefined) {
    serverUrl = Xrm.Page.context.getClientUrl();
    }
    else {
    serverUrl = Xrm.Page.context.getServerUrl();
    }
    
    var ODataPath = serverUrl + "/XRMServices/2011/OrganizationData.svc";
    var contactRequest = new XMLHttpRequest();
    
    contactRequest.open("GET", ODataPath + "/ContactSet(guid'" + contactId + "')", false);
    contactRequest.setRequestHeader("Accept", "application/json");
    contactRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    
    contactRequest.send();
    //If request was successful, parse the email address
    if(contactRequest.status == 200)
    {
    
    var retrievedContact = JSON.parse(contactRequest.responseText).d;
    var contactEmail = retrievedContact.EMailAddress1;
    
    if(contactEmail != null)
    {
    //set the value of the contacts email to the field “cobalt_contactsemail”
    Xrm.Page.getAttribute('cobalt_contactsemail').setValue(contactEmail);
    }
    else
    {
    //Default message for when the contact has no email.
    console.log('contact email not set');
    Xrm.Page.getAttribute('cobalt_contactsemail').setValue("---No Email on Contact---");
    
    }
    
    }
    else
    {
    console.log('request failed.');
    Xrm.Page.getAttribute('cobalt_contactsemail').setValue("---No Contact Found---");
    }
    
    }
    else
    {
    console.log('no contact on the form.');
    Xrm.Page.getAttribute('cobalt_contactsemail').setValue("");
    }
    
    Xrm.Page.getAttribute('cobalt_contactsemail').setSubmitMode("always");
    }