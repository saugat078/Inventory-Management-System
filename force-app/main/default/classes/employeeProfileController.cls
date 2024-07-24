public with sharing class employeeProfileController {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployeeInfo() {
        String userId = UserInfo.getUserId();
        system.debug(userId);
        
        List<Employee__c> employeeRecords = [
            SELECT Id,
                   Name, 
                   Profile_Picture__c,
                   User__c,
                   Email__c,
                   Department__c
            FROM Employee__c
            WHERE User__c = :userId
        ];
        system.debug(employeeRecords);
        return employeeRecords;
    }
}
