import { LightningElement, track, wire } from 'lwc';
import getInventoryItems from '@salesforce/apex/damageReport.getInventoryItems';
import saveDamageReport from '@salesforce/apex/damageReport.saveDamageReport';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DamageReport extends LightningElement {
    @track inventoryItems = [];
    @track selectedInventoryItem = '';
    @track selectedCondition = '';
    @track reportedById = '';
    @track description = '';
    @track image = '';
    @track errorMessages = {
        inventoryItem: '',
        condition: '',
        reportedBy: '',
        description: '',
        image: ''
    };

    get conditionOptions() {
        return [
            { label: 'Needs Repair', value: 'Needs Repair' },
            { label: 'Damaged', value: 'Damaged' }
        ];
    }

    @wire(getInventoryItems)
    wiredInventoryItems({ error, data }) {
        if (data) {
            this.inventoryItems = data.map(item => {
                return { label: item.InventoryItem__r.Name, value: item.InventoryItem__c };
            });
            this.reportedById = data[0].Employee__r.Id;
        } else if (error) {
            this.showToast('Error', 'Error loading inventory items', 'error');
        }
    }

    handleInventoryChange(event) {
        this.selectedInventoryItem = event.target.value;
        this.errorMessages.inventoryItem = '';
    }

    handleConditionChange(event) {
        this.selectedCondition = event.target.value;
        this.errorMessages.condition = '';
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
        this.errorMessages.description = '';
    }

    handleImageChange(event) {
        const content = event.target.value;
        if (content.includes('<img') && content.length === 119) {
            this.image = content;
            this.errorMessages.image = '';
        } else if (content.trim() === '') {
            this.image = content;
            this.errorMessages.image = '';
        } else {
            this.image = content;
            this.errorMessages.image = 'Please input only images in the description!!!!!';
        }
    }

    handleSave() {
        let hasError = false;

        if (!this.selectedInventoryItem) {
            this.errorMessages.inventoryItem = 'Inventory item is required';
            hasError = true;
        }
        if (!this.selectedCondition) {
            this.errorMessages.condition = 'Condition is required';
            hasError = true;
        }
        if (!this.reportedById) {
            this.errorMessages.reportedBy = 'Reported by is required';
            hasError = true;
        }
        if (!this.description) {
            this.errorMessages.description = 'Description is required';
            hasError = true;
        }
        if (!this.image) {
            this.errorMessages.image = 'Image is required';
            hasError = true;
        }
        if (this.errorMessages.image) {
            hasError = true;
        }
        if (hasError) {
            return;
        }

        saveDamageReport({
            inventoryItemId: this.selectedInventoryItem,
            reportedById: this.reportedById,
            description: this.description,
            image: this.image,
            condition: this.selectedCondition,
        })
        .then(() => {
            this.showToast('Success', 'Damage report created successfully', 'success');
            this.clearForm();
        })
        .catch(error => {
            // Check if error message is related to existing report
            if (error.body.message.includes('A damage report for this inventory item already exists')) {
                this.showToast('Error', 'A damage report for this inventory item already exists.', 'error');
            } else {
                this.showToast('Error', 'Error creating damage report', 'error');
            }
        });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    clearForm() {
        this.selectedInventoryItem = '';
        this.selectedCondition = '';
        this.reportedById = '';
        this.description = '';
        this.image = '';
        this.errorMessages = {
            inventoryItem: '',
            condition: '',
            reportedBy: '',
            description: '',
            image: ''
        };
    }
}

