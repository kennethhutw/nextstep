import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SubTabComponent } from '../subTab/subTab.component';
@Component({
  selector: "app-subtabs",
  templateUrl: "./subTabs.component.html",
  styleUrls: ["./subTabs.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class SubTabsComponent implements AfterContentInit {

  @ContentChildren(SubTabComponent) tabs: QueryList<SubTabComponent>;

  selectTab(tab: SubTabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }
}
