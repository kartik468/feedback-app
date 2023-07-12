import { Component, HostListener } from '@angular/core';
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const keyCode = event.keyCode || event.which;
    const key = String.fromCharCode(keyCode);

    // Check if the pressed key is a number (0-9)
    if (/^[0-9]$/.test(key) || /^Numpad[0-9]$/.test(event.code)) {
      let emojiIndex: number;

      // Check if the pressed key is from the number pad
      if (/^Numpad[0-9]$/.test(event.code)) {
        emojiIndex = parseInt(event.code.slice(-1), 10) - 1;
      } else {
        emojiIndex = parseInt(key, 10) - 1;
      }

      // Check if the emoji index is valid
      if (emojiIndex >= 0 && emojiIndex < this.emojis.length) {
        const emoji = this.emojis[emojiIndex];
        this.openModal(emoji);
      }
    }
  }

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
