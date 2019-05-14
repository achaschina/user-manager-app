import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { User } from 'src/models/Users';
import { MainInfoSharingService } from 'src/services/main-info-sharing.service';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.css']
})
export class MainInfoComponent implements OnInit {

  newUserFormGroup: FormGroup;

  constructor(private mainInfoService: MainInfoSharingService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.newUserFormGroup = new FormGroup({
      emailFormControl: new FormControl(this.mainInfoService.userInfo.email, [
        Validators.required,
        Validators.email
      ]),
      firstNameFormControl: new FormControl(this.mainInfoService.userInfo.firstName, [
        Validators.required
      ]),
      lastNameFormControl: new FormControl(this.mainInfoService.userInfo.lastName, [
        Validators.required
      ]),
      usernameFormControl: new FormControl(this.mainInfoService.userInfo.username, Validators.compose([
        Validators.required,
        Validators.minLength(5)])),
      phoneFormControl: new FormControl(this.mainInfoService.userInfo.phone),
      passwordFormControl: new FormControl(this.mainInfoService.userInfo.password, Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(8)]))
    });
  }

  goNext() {
    const user = {
      id: '',
      email: this.newUserFormGroup.controls.emailFormControl.value,
      firstName: this.newUserFormGroup.controls.firstNameFormControl.value,
      lastName: this.newUserFormGroup.controls.lastNameFormControl.value,
      username: this.newUserFormGroup.controls.usernameFormControl.value,
      phone: this.newUserFormGroup.controls.phoneFormControl.value,
      password: this.newUserFormGroup.controls.passwordFormControl.value,
    };
    this.mainInfoService.userInfo = user;
    console.log(this.mainInfoService.userInfo)
  }

}
