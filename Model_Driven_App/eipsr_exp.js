function AutoUpdateClientFields(executionContext) {
    var formContext = executionContext.getFormContext(); //Get form context
    var client_id = formContext.getAttribute('rd_client').getValue();
    if(client_id != null) {
        keyword = client_id[0]['name']
        if(keyword != null) {
            Xrm.WebApi.online.retrieveMultipleRecords("cr5f4_tc_episode", "?$select=cr5f4_tc_clienttc_client_first_name,cr5f4_tc_clienttc_client_id,cr5f4_tc_clienttc_client_last_name,cr5f4_tc_episode_care_provider&$filter=cr5f4_tc_clienttc_client_id eq '" + keyword + "'").then(
                function success(results) {
                    console.log(results);
                    for (var i = 0; i < results.entities.length; i++) {
                        var result = results.entities[i];
                        // Columns
                        var cr5f4_tc_episodeid = result["cr5f4_tc_episodeid"]; // Guid
                        var cr5f4_tc_clienttc_client_first_name = result["cr5f4_tc_clienttc_client_first_name"]; // Text
                        var cr5f4_tc_clienttc_client_id = result["cr5f4_tc_clienttc_client_id"]; // Text
                        var cr5f4_tc_clienttc_client_last_name = result["cr5f4_tc_clienttc_client_last_name"]; // Text
                        var cr5f4_tc_episode_care_provider = result["cr5f4_tc_episode_care_provider"]; // Text
                    };
                    formContext.getAttribute('rd_clienturn').setValue(cr5f4_tc_clienttc_client_id);
                    formContext.getAttribute('rd_clientfirstname').setValue(cr5f4_tc_clienttc_client_first_name);
                    formContext.getAttribute('rd_clientlastname').setValue(cr5f4_tc_clienttc_client_last_name);
                    formContext.getAttribute('rd_worker').setValue(cr5f4_tc_episode_care_provider);
                },
                function(error) {
                    console.log(error.message);
                }
            );
        }
    }
    console.log(client_id, keyword);
}