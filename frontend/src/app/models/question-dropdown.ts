import { QuestionBase } from 'src/app/models/question-base';

export class DropdownQuestion extends QuestionBase<string> {
  override controlType = 'dropdown';
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
