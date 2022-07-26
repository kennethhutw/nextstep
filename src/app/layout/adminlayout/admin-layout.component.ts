import { Component, OnInit } from '@angular/core';
import { DataService } from '../../_services';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'admin-layout.component.html',
  styleUrls: ['admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  display = true;


  constructor(

    private dataSrv: DataService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    //  this.dataSrv.currentShowAdminSideBar.subscribe(value => (this.display = value));
  }

  getClasses() {
    const classes = {
      'pinned-sidebar': this.dataSrv.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.dataSrv.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }
  toggleSidebar() {
    this.dataSrv.toggleSidebar();
  }
}
