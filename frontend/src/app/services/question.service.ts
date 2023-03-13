import { Injectable } from '@angular/core';

import { QuestionBase } from 'src/app/models/question-base';
import { DropdownQuestion } from 'src/app/models/question-dropdown';
import { VoteQuestion } from 'src/app/models/question-vote';
import { of } from 'rxjs';

@Injectable()
export class QuestionService {
  // TODO: get from a remote source of question metadata
  getQuestions() {
    const questions: QuestionBase<string>[] = [
      new DropdownQuestion({
        key: 'proposal',
        label: 'Proposal',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
        ],
        order: 2,
      }),

      new VoteQuestion({
        key: 'voteAmount',
        label: 'Vote Amount',
        type: 'number',
        required: true,
        order: 1,
      }),
    ];

    return of(questions.sort((a, b) => a.order - b.order));
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
