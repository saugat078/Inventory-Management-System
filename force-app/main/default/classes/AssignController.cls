public with sharing class AssignController {
    
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getAssignedInventories() {
        String userId = UserInfo.getUserId();
        system.debug(userId);
        List<Assign_Inventory__c> assignedInventories = [
            SELECT Id, 
                   InventoryItem__r.Name, 
                   Employee__r.Name, 
                   Assignment_Date__c,
                   InventoryItem__r.ItemType__r.Name,
                   Employee__r.User__c
            FROM Assign_Inventory__c
            WHERE  Employee__r.User__c = :userId];        
        
        List<Map<String, Object>> finalList = new List<Map<String, Object>>();
        
        for(Assign_Inventory__c record : assignedInventories) {
            Map<String, Object> recordMap = new Map<String, Object>();
            recordMap.put('Id', record.Id);
            recordMap.put('InventoryItemName', record.InventoryItem__r.Name);
            recordMap.put('EmployeeName', record.Employee__r.Name);
            recordMap.put('AssignmentDate', record.Assignment_Date__c);
            recordMap.put('ItemType', record.InventoryItem__r.ItemType__r.Name);
            recordMap.put('EmployeeUser', record.Employee__r.User__c);
            finalList.add(recordMap);
            
            System.debug('Inventory Item Name: ' + record.InventoryItem__r.Name);
        }
        
        return finalList;
    }
}
