import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Customer } from './customer';

// function ratingRange(c: AbstractControl): {[key: string]: boolean} | null {
//     if(c.value != undefined && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
//         return {'range': true};
//     }
//     return null;
// }

function ratingRange(min: number, max:number): ValidatorFn {
    return (c: AbstractControl): {[key: string]: boolean} | null => {
        if(c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return {'range': true};
        }
        return null;
    }
}

function emailMatcher(c: AbstractControl) {
    let emailControl = c.get('email');
    let confirmControl = c.get('confirmEmail');
    if(emailControl.pristine || confirmControl.pristine) {
        return null;
    }
    if(emailControl.value === confirmControl.value) {
        return null;
    }
    return {'match': true};
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit  {
    customerForm: FormGroup;
    customer: Customer= new Customer();
    emailMessage: string;

    private validationMessages = {
        required: 'Please enter your email address',
        pattern: 'Please enter a valid email address'
    };

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
            asdadadad: this.fb.group({
                email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
                confirmEmail: ['', Validators.required]
            }, {validator: emailMatcher}),
            phone: '',
            notification: 'email',
            rating: ['', ratingRange(1,5)],
            sendCatalog: true
        });

        this.customerForm.get('notification').valueChanges.subscribe(data => this.setNotification(data));

        const emailControl = this.customerForm.get('email');

        emailControl.valueChanges.subscribe(value => this.setMessage(emailControl));

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

    setMessage(c: AbstractControl): void {
        this.emailMessage = '';
        if((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
        }
    }
 }
