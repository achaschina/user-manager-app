import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import dataCountries from '../../../services/coutries.js';
import { MatTableDataSource } from '@angular/material';
import { MainInfoSharingService } from 'src/services/main-info-sharing.service';
import { Address } from 'src/models/Address.js';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css']
})
export class AddressInfoComponent implements OnInit {
  addressTypes = [
    { name: 'Billing address' },
    { name: 'Shipping address' }
  ];

  currentAddress;
  data:Address[] = [];

  displayedColumns: string[] = ['addressType', 'addressLine', 'city', 'country', 'postalCode'];
  dataSource = new MatTableDataSource(this.data);

  addressForm;

  hasUnitNumber = false;

  countries = dataCountries;

  constructor(private fb: FormBuilder, private mainInfoService: MainInfoSharingService) { }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.addressForm = this.fb.group({
      addressType: [null, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      countryFormControl: [null, Validators.required],
      postalCode: [null, Validators.compose([
        Validators.required, Validators.minLength(5), Validators.maxLength(5)])
      ]
    });
  }

  goNext() {
    this.newAddress();
    this.mainInfoService.adressInfo.push(this.currentAddress);
    console.log(this.mainInfoService.adressInfo, 'new address')
  }

  addNewAddress() {
    this.newAddress();
    this.data.push(this.currentAddress)
    this.dataSource = new MatTableDataSource(this.data);
    this.formInit();
    this.mainInfoService.adressInfo.push(this.currentAddress);
    console.log(this.mainInfoService.adressInfo, 'new address')
  }

  newAddress() {
    this.currentAddress = {
      addressId: Math.floor(Math.random() * Math.floor(10000000)).toString(),
      addressType: this.addressForm.controls.addressType.value,
      country: this.addressForm.controls.countryFormControl.value,
      city: this.addressForm.controls.city.value,
      postalCode: this.addressForm.controls.postalCode.value,
      addressLine: this.addressForm.controls.address.value,
    };
  }

}
