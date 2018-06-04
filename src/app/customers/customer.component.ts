import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from './customer';

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit  {
    customerForm: FormGroup;
    customer: Customer= new Customer();

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

    // populateTestData() : void {
    //     this.customerForm.setValue({
    //         firstName: 'Jack',
    //         lastName: 'Harkness',
    //         email: 'jack@torchwood.com',
    //         sendCatalog: false
    //     });
    // }

    constructor(private fb: FormBuilder) {
        
    }

    populateTestData() : void {
        this.customerForm.patchValue({
            firstName: 'Jack',
            lastName: 'Harkness'
        });
    }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName:[{value:'n/a', disabled:true}, [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
            phone: '',
            notification: 'email',
            sendCatalog: true
        });

        // this.customerForm = new FormGroup({
        //     firstName: new FormControl(),
        //     lastName: new FormControl(),
        //     email: new FormControl(),
        //     sendCatalog: new FormControl(true)
        // });
    }

    setNotification(notifyVia: string): void {
        const phoneControl = this.customerForm.get('phone');
        if(notifyVia === 'text') {
            phoneControl.setValidators(Validators.required);
        } else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    }
 }
