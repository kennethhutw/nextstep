import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import {
  ChatService,

} from './../../_services';

import {
  Utility
} from './../../_helpers';
import { environment } from './../../../environments/environment';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lab-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, AfterViewInit, OnChanges {
  loading: boolean = true;
  @Input() showComments: any;
  chatData: any[] = [];
  @Input() title: string;
  // only mentors and programmer can do private comment.
  @Input() isSupportPrivate: boolean = false;
  @Input() currentUser: any;
  @Input() receiverId: any;
  // @Input() receiverUser: any;
  _receiverUser;
  @Input() set receiverUser(object) {

    this._receiverUser = object;
    if (this._receiverUser) {
      this.initChat(this.currentUser, this._receiverUser);
    }
  };

  @Output() close = new EventEmitter();

  message: string = '';
  isChecked: boolean = false;
  sendDisabeld: boolean = true;


  constructor(
    private chatSrv: ChatService,
    private utilitySrv: Utility,
    private cdf: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.initChat(this.currentUser, this.receiverUser);
  }

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.receiverUser !== null &&
      changes.receiverUser.currentValue !== null) {

      //   this.initChat(this.currentUser, changes.receiverUser.currentValue);

      // service.setUser(changes.user)
    }
  }

  onSend() {
    console.log(this.message);
  }
  onChange(event: any) {
    this.message = event.target.textContent;
    this.sendDisabeld = event.target.textContent.length > 0;
  }

  onToggleChecked() {
    this.isChecked = !this.isChecked;
  }

  onClose() {
    this.close.emit();
  }

  onComment() {
    console.log("comment ------------")
    let _receiver = this._receiverUser.id;
    if (this.receiverId) {
      // project member
      _receiver = this.receiverId;
    }
    this.chatSrv.insert({
      sender: this.currentUser.id,
      sender_name: this.currentUser.name,
      receiver: _receiver,
      receiver_name: this._receiverUser.name,
      content: this.message,
      type: "0",
      status: "0",
      readAt: null
    }).subscribe(res => {
      if (res['result'] === 'successful') {
        this.message = "";
        this.initChat(this.currentUser, this._receiverUser);
      } else {

      }
      this.cdf.detectChanges();
    }, (error) => {
      console.error("saveError", error);

    })

  }

  IsSender(sender) {

    if (sender === this.currentUser.id) {
      return false;
    }
    else {
      return true;
    }

  }

  initChat(sender, receiver) {
    try {
      this.loading = true;
      this.chatData = [];

      if (!this.utilitySrv.IsNullOrEmpty(sender) && !this.utilitySrv.IsNullOrEmpty(receiver)) {
        let _receiverId = this._receiverUser.id;
        if (receiver.userId) {
          // project member
          _receiverId = receiver.userId;
        }
        if (!this.utilitySrv.IsNullOrEmpty(sender.id) && !this.utilitySrv.IsNullOrEmpty(_receiverId)) {
          this.chatSrv.getUserChatRecord(sender.id, _receiverId).subscribe
            (res => {
              console.log("initChat======", res)
              if (res['result'] == 'successful') {
                this.chatData = res['data'];
              }
            }, error => {
              console.log("init chat failed ", error);
            }, () => {
              this.loading = false;
              this.cdf.detectChanges();
            })
        }
      }

    } catch (error) {
      console.log("init chat ", error);
      this.loading = false;
    }
  }

  getImg(imageUrl) {
    console.log("imageUrl======", imageUrl)
    if (imageUrl != null) {
      return environment.assetUrl + imageUrl;
    } else {
      return '/assets/images/user.png';
    }
  }
}
