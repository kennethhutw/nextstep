import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  SubscribeService,
  ToastService
} from "../../_services";

import { Utility } from "../../_helpers";


import {
  ActivatedRoute,
  Router
} from "@angular/router";

@Component({
  selector: "app-unsubscribe",
  templateUrl: "./unsubscribe.component.html",
  styleUrls: [
    "./unsubscribe.component.scss",
  ],
  encapsulation: ViewEncapsulation.None
})
export class UnsubscribeComponent implements OnInit, AfterViewInit {


  pId: string = "";
  currentSubSetting = {
    id: "",
    email: "",
    userId: "",
    project: false,
    member: false
  };
  //UPDATEDFAILED
  msg = {

    updateSuc: "",
    updateFailed: "",


  }
  disabled = false;
  constructor(

    private router: Router,
    public toastSrv: ToastService,
    private route: ActivatedRoute,
    private translateSrv: TranslateService,
    private utilitySrv: Utility,
    private dataSrv: DataService,
    private subscribeSrv: SubscribeService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.intialTerms();

    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.intialTerms();
      }
    });

  }

  ngOnInit() {
    this.pId = this.route.snapshot.queryParams.d;

    this.subscribeSrv.getById(this.pId).then(res => {

      if (res['result'] == 'successful') {

        this.currentSubSetting = res['data'];
      }
    }).catch(error => {
      console.error("cannot get setting.", error);
    })
  }

  intialTerms() {

    this.translateSrv.get("UPDATEDSUC").subscribe((text: string) => {
      this.msg.updateSuc = text;
    });

    this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
      this.msg.updateFailed = text;
    });
  }

  ngAfterViewInit(): void {


  }


  onUnsubscribe($event) {
    this.disabled = true;
    this.subscribeSrv.update(this.pId, {
      project: 0,
      member: 0
    }).then(res => {

      this.toastSrv.showToast("",
        this.msg.updateSuc,
        this.toastSrv.iconClasses.success);
    }).catch(error => {
      console.error("cannot get setting.", error);
      this.toastSrv.showToast("",
        this.msg.updateFailed,
        this.toastSrv.iconClasses.error);
    }).then(res => {
      this.disabled = false;
    })
  }


}
