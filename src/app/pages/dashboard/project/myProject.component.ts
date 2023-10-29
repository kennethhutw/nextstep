import {
  ViewEncapsulation,
  Component,
  OnInit,
  HostListener
} from '@angular/core';

import {
  DialogService,
  ProjectService,
  ToastService,
  DataService
} from './../../../_services';
import { Utility } from "../../../_helpers";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import {
  AuthStore
} from "../../../_services/auth.store";

@Component({
  selector: 'app-my-project',
  templateUrl: './myProject.component.html',
  styleUrls: ['./myProject.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyProjectComponent implements OnInit {

  loading = true;
  isFindPartnerPanel: boolean = false;
  currentUser;
  projectMsg = "";
  currentTab = "published";
  publishedprojects = [];
  draftedprojects = [];

  msg = {
    deleted: "",
  }

  isMobile = false;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    let screenWidth = window.innerWidth;
    if (screenWidth < 500) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  constructor(
    private translateSrv: TranslateService,
    public utilitySrv: Utility,
    private dataSrv: DataService,
    private toastSrv: ToastService,
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore,
    private spinnerSrv: NgxSpinnerService) {

    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.init_terms(_lang);
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.init_terms(lang);
      }
    });
    this.getScreenSize();
  }

  ngOnInit() {

    this.spinnerSrv.show();
    this.currentUser = this.authStoreSrv.getUserData();
    this.projectSrv.getProjectsByUid(
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        if (res['data']) {
          let data = res['data'];
          if (data.length > 0) {
            this.publishedprojects = data.filter((project) => {
              return project.status == 'published'
            });
            this.draftedprojects = data.filter((project) => {
              return project.status == 'draft'
            });

          }

        }
        this.loading = false;
        this.spinnerSrv.hide();
      }
    }).catch((e) => {
      this.loading = false;
      this.spinnerSrv.hide();
      console.error("load failed", e)
    })

  }

  init_terms(lang) {


  }

  changeTab(tab) {
    this.currentTab = tab;
  }


}
