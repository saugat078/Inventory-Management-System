import { LightningElement, wire } from 'lwc';
import getEmployeeInfo from '@salesforce/apex/employeeProfileController.getEmployeeInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Employee__c.Name';
import EMAIL_FIELD from '@salesforce/schema/Employee__c.Email__c';
import PHONE_FIELD from '@salesforce/schema/Employee__c.PhoneNumber__c';
import ADDRESS_FIELD from '@salesforce/schema/Employee__c.Address__c';
import DOB_FIELD from '@salesforce/schema/Employee__c.Date_Of_Birth__c';
import AGE_FIELD from '@salesforce/schema/Employee__c.Age__c';
import PROFILE_PICTURE_FIELD from '@salesforce/schema/Employee__c.Profile_Picture__c';
import DEPARTMENT_FIELD from '@salesforce/schema/Employee__c.Department__c';
import { refreshApex } from '@salesforce/apex';

export default class EmployeeProfile extends LightningElement {
    employee;
    error;
    recordId;
    objectApiName = 'Employee__c';
    editFields = [NAME_FIELD, EMAIL_FIELD, PHONE_FIELD, ADDRESS_FIELD, DOB_FIELD, AGE_FIELD, PROFILE_PICTURE_FIELD, DEPARTMENT_FIELD];
    readOnlyFields = [NAME_FIELD, EMAIL_FIELD, PHONE_FIELD, ADDRESS_FIELD, DOB_FIELD, AGE_FIELD, DEPARTMENT_FIELD];
    isEditMode = false;
    wiredEmployeeResult;
    profilePicture;

    @wire(getEmployeeInfo)
    
    wiredEmployeeInfo(result) {
        this.wiredEmployeeResult = result;//object to refresh after update of profile picture...
        const { data, error } = result;
        if (data) {
            console.log('Data:', data);
            if (Array.isArray(data) && data.length > 0) {
                this.employee = data[0];
                this.recordId = this.employee.Id;
                this.extractProfilePictureUrl();
                this.error = undefined;
            } else {
                this.employee = null;
                this.error = 'No employee record found';
            }
        } else if (error) {
            this.error = error;
            this.employee = undefined;
            console.error('Error fetching employee info:', error);
        }
    }
    
    extractProfilePictureUrl() {
        const profilePictureHtml = this.employee.Profile_Picture__c;
        if (profilePictureHtml) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(profilePictureHtml, 'text/html');
            const imgElement = doc.querySelector('img');
            const srcAttribute = imgElement ? imgElement.getAttribute('src') : null;
            console.log('Image URL:', srcAttribute);
            this.profilePicture = srcAttribute;
        }
    }

    handleSuccess(event) {
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Employee record updated successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
        this.isEditMode = false;
        refreshApex(this.wiredEmployeeResult).then(() => {
            this.extractProfilePictureUrl();
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        this.template.querySelector('lightning-record-form').submit(fields);

    }

    handleCancel() {
        this.isEditMode = false;
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
    }
}
