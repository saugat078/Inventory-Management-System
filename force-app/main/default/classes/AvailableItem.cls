public with sharing class AvailableItem {
    @AuraEnabled(cacheable=true)   
    public static List<Map<String, Object>>getAvailableItems() {
        List<InventoryItem__c> availableItems = [SELECT Id,Name, Status__c, ItemType__r.Name,Condition__c FROM InventoryItem__c WHERE Status__c = 'Available'];
        List<Map<String, Object>> finalList = new List<Map<String, Object>>();
        for(InventoryItem__C record : availableItems) {
            Map<String, Object> recordMap = new Map<String, Object>();
            recordMap.put('Id', record.Id);
            recordMap.put('InventoryItemName', record.Name);
            recordMap.put('ItemType', record.ItemType__r.Name);
            recordMap.put('Status', record.Status__c);
            finalList.add(recordMap);
            System.debug(finallist);
        }
        return finalList;
    }
}
