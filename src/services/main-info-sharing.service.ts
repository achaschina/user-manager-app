import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models/Users';
import { Address } from 'src/models/Address';
import { from, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageAlert } from 'src/models/MessageAlert';
import { Observable} from 'rxjs';

@Injectable()
export class MainInfoSharingService {
  private usersList: User[] = [];
  private usersUpdated = new Subject<User[]>();
  userInfo: User = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    password: '',
  };
  adressInfo: Address[] = [];
  private messageAlert = new Subject<MessageAlert>();

  constructor(private http: HttpClient) { }

  addUser() {
    this.http.post<{message: string, user: any}>('http://localhost:3000/api/v1/add', this.userInfo)
        .subscribe((data) => {
          this.messageAlert.next({type: 'successful', text: data.message});
          this.addAddress(data.user.id);
        });
  }

  addAddress(id) {
    const body = {
      id,
      adressInfo: this.adressInfo
    };
    console.log(body, 'bodyAddress')
    this.http.post<{message: string, users: any}>('http://localhost:3000/api/v1/addAddress', body)
    .subscribe((data) => {
      console.log(data);
    });
  }

  updateAddress(body) {
    return this.http.post<Address>('http://localhost:3000/api/v1/updateAddress', body)
    .pipe(
      map(response => response)
    );
  }

  deleteAddress(body) {
    // console.log(body, 'bodyAddress update');
    const url = `http://localhost:3000/api/v1/deleteAddress/${body.id}/${body.addressId}`;
    return this.http.delete<any>(url)
    .pipe(
      map(response => response)
    );
  }

  getUserById(id): Observable<User> {
    const url = `http://localhost:3000/api/v1/${id}`;
    return this.http.get<User>(url)
        .pipe(
            map(response => response)
        );
  }

  findUsers(body): Observable<User[]> {
    return this.http.post<User[]>('http://localhost:3000/api/v1/findUsers', body)
        .pipe(
            map(response => response)
        );
  }

  getUsers() {
    this.http.get<{message: string, users: any}>('http://localhost:3000/api/v1/all')
    .pipe(
      map(data => {
        return {
          users: data.users.map(user => {
            return {
              id: user._id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              phone: user.phone,
              password: user.password,
            };
          })
        };
      })
    )
    .subscribe((transformedData) => {
      this.usersList = transformedData.users;
      this.usersUpdated.next([...this.usersList]);
    });
  }


  deleteUser(id): Observable<User> {
    const url = `http://localhost:3000/api/v1/delete/${id}`;
    return this.http.delete<User>(url)
        .pipe(
            map(response => response)
        );
  }

  updateUser(body): Observable<User> {
    console.log('body', body)
    const url = `http://localhost:3000/api/v1/updateUser`;
    return this.http.post<User>(url, body)
        .pipe(
            map(response => response)
        );
  }

  getPostUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  messageAlertListener() {
    return this.messageAlert.asObservable();
  }
}
