import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/models/Users';
import { MainInfoSharingService } from 'src/services/main-info-sharing.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private usersSub: Subscription;

  constructor(private mainInfoService: MainInfoSharingService) { }

  ngOnInit() {
    this.mainInfoService.getUsers();
    this.usersSub = this.mainInfoService
      .getPostUpdateListener()
      .subscribe(
        (userData: User[]) => {
          this.users = userData;
          console.log(this.users)
        }
      );
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

}
