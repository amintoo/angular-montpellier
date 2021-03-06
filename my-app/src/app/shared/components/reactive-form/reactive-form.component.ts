import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Item } from '../../interfaces/item';
import { State } from '../../enums/state.enum';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {
  public listStates = Object.values(State);
  public form: FormGroup;
  @Output() newCmd: EventEmitter<Item> = new EventEmitter();
  @Input() edit$: Subject<Item>;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.edit$.subscribe((data) => {
      this.form.get('name').setValue(data.name);
    });
  }

  public process(): void {
    this.newCmd.emit(this.form.value);
    this.form.reset();
    this.form.get('state').setValue(State.ALIVRER);
  }

  private createForm(data?: Item) {
    this.form = this.fb.group({
      name: [
        data ? data.name : '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ],
      reference: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)])
      ],
      state: State.ALIVRER,
      dateLivraison: [new Date(), Validators.required]
    });
  }

  public isError(fieldName: string): Boolean {
    return this.form.get(fieldName).invalid && this.form.get(fieldName).touched;
  }

}
