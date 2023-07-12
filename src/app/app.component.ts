import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

interface Feedback {
  shortId: string;
  emoji: Emoji;
  feedback: string;
}

interface Emoji {
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

  showModal = false;
  modalTitle = '';

  constructor(private http: HttpClient) {}

  openModal(emoji: Emoji) {
    this.selectedEmoji = emoji;
    this.modalTitle = this.shortIdCtrl.value || '';
    this.showModal = true;

    const feedback: Feedback = {
      emoji,
      feedback: this.feedbackCtrl.value || '',
      shortId: this.shortIdCtrl.value || '',
    };

    console.log(feedback);

    this.http
      .post<any>('http://localhost:3000/save-feedback', { feedback })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );

    setTimeout(() => {
      this.closeModal();
      this.feedbackCtrl.reset();
      this.shortIdCtrl.reset();
    }, 1000);
  }

  closeModal(): void {
    this.showModal = false;
  }
}
