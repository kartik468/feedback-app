import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackModalComponent } from './feedback-modal/feedback-modal.component';

export interface Feedback {
  shortId: string;
  emoji: Emoji;
  feedback: string;
}

export interface Emoji {
  emojiCode: string;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'feedback-app';

  shortIdCtrl = new FormControl('');
  feedbackCtrl = new FormControl('');

  selectedEmoji!: Emoji;

  emojis = [
    {
      emojiCode: '&#128512;',
      description: 'Grinning Face',
    },
    {
      emojiCode: '&#128513;',
      description: 'Grinning Face with Smiling Eyes',
    },
    {
      emojiCode: '&#128514;',
      description: 'Face with Tears of Joy',
    },
  ];

  modalTitle = '';

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  openModal(emoji: Emoji) {
    this.selectedEmoji = emoji;
    this.modalTitle = this.shortIdCtrl.value || '';

    const feedback: Feedback = {
      emoji,
      feedback: this.feedbackCtrl.value || '',
      shortId: this.shortIdCtrl.value || '',
    };

    console.log(feedback);

    const modalRef = this.modalService.open(FeedbackModalComponent);
    modalRef.componentInstance.feedback = feedback;

    this.http
      .post<any>('http://localhost:3000/save-feedback', { feedback })
      .subscribe(
        (response) => {
          console.log(response);
          this.resetControls();
        },
        (error) => {
          console.error(error);
          this.resetControls();
        }
      );
  }

  resetControls() {
    this.feedbackCtrl.reset();
    this.shortIdCtrl.reset();
  }
}
