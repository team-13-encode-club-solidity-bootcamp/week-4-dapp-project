import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';

@NgModule({
  declarations: [AppComponent, DynamicFormComponent, DynamicFormQuestionComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
