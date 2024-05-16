import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    this.router.navigate(['/home']);
  }
  isSidePanelOpen: boolean = false;
  ngOnInit(): void {
  }

  toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  closeSidePanel() {
    this.isSidePanelOpen = false;
  }


}
