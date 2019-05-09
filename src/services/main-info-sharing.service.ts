import { Injectable } from '@angular/core';
import { User } from 'src/models/Users';
import { Address } from 'src/models/Address';

@Injectable()
export class MainInfoSharingService {
  userInfo: User = {
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    password: '',
  };
  adressInfo: Address[] = [];

  constructor() { }
}
