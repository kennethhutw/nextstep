import {
  Component, OnInit, Input, Output,
  ChangeDetectorRef,
  ViewEncapsulation,
  EventEmitter
} from "@angular/core";
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {
  Utility
} from './../../_helpers';
export interface IlinkPreview {
  description: string;
  image: string;
  title: string;
  url: string;
}


@Component({
  selector: "app-linkpreview",
  templateUrl: "./linkpreview.component.html",
  styleUrls: ["./linkpreview.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LinkPreviewComponent implements OnInit {
  preview: IlinkPreview = {
    title: '',
    description: '',
    url: '',
    image: ''
  };

  isLoading: boolean = true;
  isFailed: boolean = false;

  // Regular Expression for validating the link the user enters
  private regExHyperlink = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  @Output() onMetaData = new EventEmitter<any>();

  _link = new FormControl('', [Validators.required, Validators.pattern(this.regExHyperlink)]);

  @Input() set link(value) {
    this._link = value;

    this.getLinkPreview(value)
      .subscribe(preview => {
        this.preview = preview;
        if (preview.images.length > 0) {
          this.preview.image = preview.images[0];
        }
        if (!this.preview.title) {
          this.preview.title = this.preview.url;
        }
        this.onMetaData.emit(this.preview);
        this.changeDetectorRef.detectChanges();
      }, error => {
        this.preview.url = this.link;
        this.preview.title = this.preview.url;
      });
  };

  @Input() set metadata(values) {
    if (!this.utilitySrv.IsNullOrEmpty(values)) {
      this.preview = values;
    }
    this.changeDetectorRef.detectChanges();
  }
  constructor(
    private http: HttpClient,
    private utilitySrv: Utility,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {

  }

  // Gets preview JSON from linkpreview.net
  // It's free unless you do more than 60 requests per hour
  // You should probably create a service for this function
  getLinkPreview(link: string): Observable<any> {
    // Go to linkpreview.net to get your own key and place it below, replacing <key>
    const api = 'https://jsonlink.io/api/extract?url=' + link;
    //https://jsonlink.io/api/extract?url=https://www.facebook.com/groups/uiuxsideproject
    return this.http.get(api);
  }


  onCancel() {
    this.preview = {
      title: '',
      description: '',
      url: '',
      image: ''
    };
    this.link.reset();
  }


  // Subscribe to link preview.  If errors because site not found, still to show the URL, even if we can't show a preview
  onPreview() {
    this.getLinkPreview(this.link.value)
      .subscribe(preview => {
        this.preview = preview;

        if (!this.preview.title) {
          this.preview.title = this.preview.url;
        }

      }, error => {
        this.preview.url = this.link.value;
        this.preview.title = this.preview.url;
      });
  }


  onSubmit() {

    this.preview = {
      title: '',
      description: '',
      url: '',
      image: ''
    };
    this.link.reset();
  }


  onImgError(event) {
    event.target.src = "assets/images/defaultProjectIcon.png";
  }
}
