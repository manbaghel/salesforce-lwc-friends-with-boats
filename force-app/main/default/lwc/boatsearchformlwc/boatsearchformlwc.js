import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import getAllBoatTypes from "@salesforce/apex/BoatSearchFormController.getAllBoatTypes";

export default class Boatsearchformlwc extends NavigationMixin(LightningElement) {

    @wire(CurrentPageReference)
    pageRef;

    @track
    boatTypeOptionsDisabled = true;

    @track
    boatTypeOptions = [];

    @track
    selectedBoatType = "";

    @api
    get newAvailable() {
        return this.pageRef ? true : false
    }

    async loadBoatTypes() {
        this.boatTypeOptions = [
            {
                label: "Loading Boat Types...",
                value: ""
            }
        ];
        try {
            const boatTypes = await getAllBoatTypes();
            const boatTypeOptions = boatTypes.map(r => {
                return {
                    label: r.Name,
                    value: r.Id
                };
            });
            boatTypeOptions.unshift({
                label: "All Types",
                value: ""
            });
            this.boatTypeOptions = boatTypeOptions;
            this.boatTypeOptionsDisabled = false;
        } catch(error) {
            this.boatTypeOptions = [{
                label: "Error loading Boat types",
                value: ""
            }];
        }
    }

    async connectedCallback() {
        return this.loadBoatTypes();
    }

    onBoatTypeChange(event) {
        this.selectedBoatType = event.detail.value;
    }

    onNewBoat() {
        console.log("-- Create New Boat");
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c', // objectApiName is optional
                actionName: 'new',
                BoatType__c : this.selectedBoatType || undefined
            }
        });
    }

    onFormSubmit() {
        console.log(`-- Page Ref: ` + this.pageRef);
        this.dispatchEvent(new CustomEvent("formsubmit", {
            detail: {
                boatTypeId: this.selectedBoatType
            }
        }))
    }
    
}