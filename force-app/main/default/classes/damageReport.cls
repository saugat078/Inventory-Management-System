public with sharing class damageReport {
    @AuraEnabled(cacheable=true)
    public static List<Assign_Inventory__c> getInventoryItems() {
        String userId = UserInfo.getUserId();
        system.debug(userId);
        List<Assign_Inventory__c>userData= [SELECT Id, InventoryItem__r.Name,EmpId__c,employee__r.Id FROM Assign_Inventory__c where EmpId__c=:userId];
        return userData;
    }
    @AuraEnabled
    public static void saveDamageReport(Id inventoryItemId, String description, String image,string reportedById,string condition, String uId) {
        List<Damage_Report__c> existingReports = [SELECT Id FROM Damage_Report__c WHERE InventoryItem__c = :inventoryItemId LIMIT 1];
        
        if (!existingReports.isEmpty()) {
            throw new AuraHandledException('A damage report for this inventory item already exists.');
        }
        Damage_Report__c newReport = new Damage_Report__c(
            InventoryItem__c = inventoryItemId,
            Reported_By__c = reportedById,
            Report_Date__c = Date.today(),
            Condition__c=condition,
            Description__c = description,
            Damaged_Image__c = image,
            UID__c=uId
        );
        insert newReport;
    }
}
