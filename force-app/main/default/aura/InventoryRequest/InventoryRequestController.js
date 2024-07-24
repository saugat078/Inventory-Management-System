({
    init: function(component, event, helper) {
        var flow = component.find("flowData");
        var inputVariables = [
        ];
        flow.startFlow("Request_Flow", inputVariables);
    },
    
    handleStatusChange: function (component, event, helper) {
        if (event.getParam("status") === "FINISHED") {
        }
    }
})
