import { Component, OnInit } from '@angular/core';
import { MainInfoSharingService } from 'src/services/main-info-sharing.service';
import { MessageAlert } from 'src/models/MessageAlert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-info',
  templateUrl: './common-info.component.html',
  styleUrls: ['./common-info.component.css']
})
export class CommonInfoComponent implements OnInit {
  commonInfo = [];
  messageAlert: MessageAlert = {type: '', text: ''};
  private messageSub: Subscription;


  constructor(private mainInfoService: MainInfoSharingService) { }

  ngOnInit() {
    const obj = {
      ...this.mainInfoService.adressInfo,
      ...this.mainInfoService.userInfo
    };

    for (let key in obj) {
      if (typeof(obj[key]) == 'string') {
        this.commonInfo.push(obj[key]);
      }
      else {
        for (let key2 in obj[key]) {
          this.commonInfo.push(obj[key][key2]);
        }
      }
    }
    // console.log(this.commonInfo);
  }

  addUser() {
    this.mainInfoService.addUser();
    this.messageSub = this.mainInfoService
      .messageAlertListener()
      .subscribe(
        (data: any) => {
          this.messageAlert = data;
          if (this.messageAlert.type === 'successful') {
            // this.mainInfoService.adressInfo = [];
            this.mainInfoService.userInfo = {
              id: '',
              email: '',
              firstName: '',
              lastName: '',
              username: '',
              phone: '',
              password: '',
            };
          }
        }
      );
  }

}
