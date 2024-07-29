import { LightningElement, wire } from 'lwc';
import getAvailableItems from '@salesforce/apex/AvailableItem.getAvailableItems';

const columns = [
    { label: 'Inventory Item', fieldName: 'InventoryItemName', type: 'text' },
    { label: 'Item Type', fieldName: 'ItemType', type: 'text' },
    { label: 'Status', fieldName: 'Status', type: 'text' },
];

export default class AvailableInventory extends LightningElement {
    availableInventories = [];
    columns = columns;

    @wire(getAvailableItems)
    wiredAvailableInventories({ error, data }) {
        if (data) {
            this.availableInventories = data;
            console.log('Available Inventories:', this.availableInventories);
        } else if (error) {
            console.error('Error loading available inventories:', error);
        }
    }
}
