import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-profile-editor",
  templateUrl: "./profile-editor.component.html",
  styleUrls: ["./profile-editor.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileEditorComponent {
  profileForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    notifications: new FormControl(false),
    bio: new FormControl('', Validators.required),
    imagePath: new FormControl(''),
    website: new FormControl(''),
    twitter: new FormControl(''),
    instagram: new FormControl(''),
    location: new FormControl('')
  });
  @Input('tabTitle') title: string;
  @Input() active = false;
  constructor(private translateSrv: TranslateService) { }

  ngOnInit() {

  }

}
