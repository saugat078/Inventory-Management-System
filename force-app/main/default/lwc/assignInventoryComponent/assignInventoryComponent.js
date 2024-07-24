import { LightningElement, wire } from 'lwc';
import getAssignedInventories from '@salesforce/apex/AssignController.getAssignedInventories';

const columns = [
    { label: 'Inventory Item', fieldName: 'InventoryItemName', type: 'text' },
    { label: 'Assignment Date', fieldName: 'AssignmentDate', type: 'date' },
    { label: 'Item Type', fieldName: 'ItemType', type: 'text' },
];

export default class AssignInventoryComponent extends LightningElement {
    assignedInventories = [];

    @wire(getAssignedInventories)
    wiredAssignedInventories({ error, data }) {
        if (data) {
            this.assignedInventories = data;
            console.log('Assigned Inventories:', this.assignedInventories);
        } else if (error) {
            console.error('Error loading assigned inventories:', error);
        }
    }
    columns = columns;
}
