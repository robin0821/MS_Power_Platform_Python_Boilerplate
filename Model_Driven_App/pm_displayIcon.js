function displayFinancialRating(rowData, userLCID) {      
    var str = JSON.parse(rowData);  
    var coldata = str.bi_financialrating_Value;  
    var imgName = "";  
    var tooltip = "";  
    console.log(coldata, str);
    switch (parseInt(coldata,10)) { 
        case 100000003:  
            imgName = "bi_pm_healthcheck_green_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "On Track";  
                    break;  
                default:  
                    tooltip = "On Track";  
                    break;  
            }  
            break;  
        case 100000002:  
            imgName = "bi_healthcheck_amber_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "Monitor";  
                    break;  
                default:  
                    tooltip = "Monitor";  
                    break;  
            }  
            break;  
        case 100000001:  
            imgName = "bi_healthcheck_red_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "Requires Action";  
                    break;  
                default:  
                    tooltip = "Requires Action";  
                    break;  
            }  
            break;  
        default:  
            imgName = "";  
            tooltip = "";  
            break;  
    }  
    var resultarray = [imgName, tooltip];  
    return resultarray;  
}  

function displayScheduleRating(rowData, userLCID) {      
    var str = JSON.parse(rowData);  
    var coldata = str.bi_schedulerating_Value;  
    var imgName = "";  
    var tooltip = "";  
    console.log(coldata, str);
    switch (parseInt(coldata,10)) { 
        case 100000003:  
            imgName = "bi_pm_healthcheck_green_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "On Track";  
                    break;  
                default:  
                    tooltip = "On Track";  
                    break;  
            }  
            break;  
        case 100000002:  
            imgName = "bi_healthcheck_amber_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "Monitor";  
                    break;  
                default:  
                    tooltip = "Monitor";  
                    break;  
            }  
            break;  
        case 100000001:  
            imgName = "bi_healthcheck_red_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "Requires Action";  
                    break;  
                default:  
                    tooltip = "Requires Action";  
                    break;  
            }  
            break;  
        default:  
            imgName = "";  
            tooltip = "";  
            break;  
    }  
    var resultarray = [imgName, tooltip];  
    return resultarray;  
}  

function displayResourceRating(rowData, userLCID) {      
    var str = JSON.parse(rowData);  
    var coldata = str.bi_resourcerating_Value;  
    var imgName = "";  
    var tooltip = "";  
    console.log(coldata, str);
    switch (parseInt(coldata,10)) { 
        case 100000003:  
            imgName = "bi_pm_healthcheck_green_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "On Track";  
                    break;  
                default:  
                    tooltip = "On Track";  
                    break;  
            }  
            break;  
        case 100000002:  
            imgName = "bi_healthcheck_amber_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "Monitor";  
                    break;  
                default:  
                    tooltip = "Monitor";  
                    break;  
            }  
            break;  
        case 100000001:  
            imgName = "bi_healthcheck_red_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "Requires Action";  
                    break;  
                default:  
                    tooltip = "Requires Action";  
                    break;  
            }  
            break;  
        default:  
            imgName = "";  
            tooltip = "";  
            break;  
    }  
    var resultarray = [imgName, tooltip];  
    return resultarray;  
}  

function displayQualityRating(rowData, userLCID) {      
    var str = JSON.parse(rowData);  
    var coldata = str.bi_qualityrating_Value;  
    var imgName = "";  
    var tooltip = "";  
    console.log(coldata, str);
    switch (parseInt(coldata,10)) { 
        case 100000003:  
            imgName = "bi_pm_healthcheck_green_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "On Track";  
                    break;  
                default:  
                    tooltip = "On Track";  
                    break;  
            }  
            break;  
        case 100000002:  
            imgName = "bi_healthcheck_amber_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "Monitor";  
                    break;  
                default:  
                    tooltip = "Monitor";  
                    break;  
            }  
            break;  
        case 100000001:  
            imgName = "bi_healthcheck_red_indicator";  
            switch (userLCID) {  
                case 1036:  
                    tooltip = "Requires Action";  
                    break;  
                default:  
                    tooltip = "Requires Action";  
                    break;  
            }  
            break;  
        default:  
            imgName = "";  
            tooltip = "";  
            break;  
    }  
    var resultarray = [imgName, tooltip];  
    return resultarray;  
}  