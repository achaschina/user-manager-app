import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { User } from 'src/models/Users';
import { MainInfoSharingService } from 'src/services/main-info-sharing.service';
import { Subscription } from 'rxjs';
import { Address } from 'src/models/Address';
import { SearchParams } from 'src/models/SearchParams';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import dataCountries from 'src/services/coutries.js';

export interface DialogData {
  answear: boolean;
}

export interface DialogDataUpdate {
  currentUser: User;
}
export interface DialogDataUpdateAddress {
  currentAddress: Address;
  itsNewAddress: boolean;
}

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})

export class UserSearchComponent implements OnInit {
  searchForm;
  data: User[] = [];
  addressData: Address[] = [];
  private usersSub: Subscription;
  currentUser: any;

  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'email', 'phone', 'action'];
  dataSource = new MatTableDataSource(this.data);

  addressDisplayedColumns: string[] = ['addressType', 'country', 'city', 'postalCode', 'addressLine', 'action'];
  addressDataSource = new MatTableDataSource(this.addressData);

  constructor(private fb: FormBuilder,
    private mainInfoService: MainInfoSharingService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.searchForm = this.fb.group({
      firstName: null,
      lastName: null,
      username: null,
      email: null,
      phone: null
    });
  }

  find() {
    const params: SearchParams = {};
    params.firstName = this.searchForm.controls.firstName.value;
    params.lastName = this.searchForm.controls.lastName.value;
    params.username = this.searchForm.controls.username.value;
    params.email = this.searchForm.controls.email.value;
    params.phone = this.searchForm.controls.phone.value;
    this.mainInfoService.findUsers(params)
      .subscribe(
        (userData: User[]) => {
          this.data = userData;
          this.dataSource = new MatTableDataSource(this.data);
          console.log(this.data)
        }
      );

  }

  getAddress(element) {
    this.currentUser = element;
    console.log(this.currentUser)
    this.addressData = [];
    this.mainInfoService.getUserById(element._id).subscribe((data) => {
      this.addressData = data.address;
      this.addressDataSource = new MatTableDataSource(this.addressData);
    });
  }

  cansel() {
    this.formInit();
    this.dataSource = new MatTableDataSource();
    this.addressDataSource = new MatTableDataSource();
    this.addressData = [];
    this.data = [];
  }

  deleteUser(e, id) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(AppDialogAreYouSureComponent, {
      width: '250px',
      data: { answear: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', id);
      if (result) {
        this.mainInfoService.deleteUser(id)
          .subscribe(
            (userData: User) => {
              this.cansel();
              this.find();
            }
          );
      }
    });
  }

  updateUser(e, element) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(AppDialogUpdateComponent, {
      width: '25rem',
      data: { currentUser: element, itsNewAddress: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        this.mainInfoService.updateUser(result)
          .subscribe(
            (userData: User) => {
              console.log(userData, 555)
              this.find();
            }
          );
      }
    });
  }

  addNewAddress(e, element) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(AppDialogUpdateAddressComponent, {
      width: '25rem',
      data: { currentAddress: element, itsNewAddress: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        this.mainInfoService.adressInfo = result;
        this.mainInfoService.addAddress(this.currentUser._id);
        // setTimeout(this.getAddress(this.currentUser), 2)
        setTimeout(() => {
          this.getAddress(this.currentUser);
        }, 2000);
      }
    });
  }

  updateAddress(e, element) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(AppDialogUpdateAddressComponent, {
      width: '25rem',
      data: { currentAddress: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        const body = {
          ...result,
          id: this.currentUser._id
        };
        this.mainInfoService.updateAddress(body)
          .subscribe(
            (addressData: Address) => {
              console.log(addressData, 'new addressData')
              // this.find();
            }
          );
      }
    });
  }

  deleteAddress(e, element) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(AppDialogAreYouSureComponent, {
      width: '250px',
      data: { answear: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',element);
      if (result) {
        let body = {addressId: element.addressId, id: this.currentUser._id};
        // console.log(body)
        this.mainInfoService.deleteAddress(body)
          .subscribe(
            (userData: any) => {
              setTimeout(() => {
                this.getAddress(this.currentUser);
              }, 2000);
              // this.cansel();
              // this.find();
            }
          );
      }
    });
  }

}

@Component({
  selector: 'app-dialog-are-you-sure',
  templateUrl: 'app-dialog-are-you-sure.html',
})
export class AppDialogAreYouSureComponent {

  constructor(
    public dialogRef: MatDialogRef<AppDialogAreYouSureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.data.answear = false;
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-update',
  templateUrl: 'app-dialog-update.html',
  styleUrls: ['./user-search.component.css']
})
export class AppDialogUpdateComponent implements OnInit {
  updateForm;
  firstName = '';
  lastName = '';
  username = '';
  phone = '';
  email = '';
  password = '';

  constructor(
    public dialogRef: MatDialogRef<AppDialogUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataUpdate,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // formInit() {
  //   this.updateForm = this.fb.group({
  //     firstName: this.data.currentUser.firstName,
  //     lastName: this.data.currentUser.lastName,
  //     username: this.data.currentUser.username,
  //     email: this.data.currentUser.email,
  //     phone: this.data.currentUser.phone
  //   });
  // }

}

@Component({
  selector: 'app-dialog-update-address',
  templateUrl: 'app-dialog-update-address.html',
  styleUrls: ['./user-search.component.css']
})
export class AppDialogUpdateAddressComponent implements OnInit {
  addressTypes = [
    { name: 'Billing address' },
    { name: 'Shipping address' }
  ];
  countries = dataCountries;
  addressType = '';
  country = '';
  city = '';
  postalCode = '';
  addressLine = '';
  itsNewAddress = false;
  // password = '';

  constructor(
    public dialogRef: MatDialogRef<AppDialogUpdateAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataUpdateAddress) { }

  ngOnInit() {
    this.itsNewAddress = this.data.itsNewAddress;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
