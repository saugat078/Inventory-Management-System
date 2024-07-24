({
    doInit: function(component, event, helper) {
        // Fetch data from server
        var action = component.get("c.getDamageReports");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.damageReports", response.getReturnValue());
            } else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);

        // Define table columns
        component.set("v.columns", [
            { label: "Report Number", fieldName: "Report_Number__c", type: "text" },
            { label: "Inventory Item", fieldName: "Inventory_Item__r.Name", type: "text" },
            { label: "Reported By", fieldName: "Reported_By__r.Name", type: "text" },
            { label: "Report Date", fieldName: "Report_Date__c", type: "date" },
            { label: "Condition", fieldName: "Condition__c", type: "text" },
            { label: "Description", fieldName: "Description__c", type: "text" },
            { label: "Damage Image", fieldName: "Damage_Image__c", type: "url", typeAttributes: { target: "_blank" } }
        ]);
    },
    
    handleRowAction: function(component, event, helper) {
    }
})
