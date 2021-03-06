import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-my-reports-sort-filter',
  templateUrl: './my-reports-sort-filter.component.html',
  styleUrls: ['./my-reports-sort-filter.component.scss'],
})
export class MyReportsSortFilterComponent implements OnInit {

  @Input() filters: Partial<{
    state: string;
    date: string;
    customDateStart: Date;
    customDateEnd: Date;
    sortParam: string;
    sortDir: string;
  }>;

  fg: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.fg = this.fb.group({
      sortParam: [
        this.filters && this.filters.sortParam || 'rp_created_at', Validators.required
      ],
      sortDir: [
        this.filters && this.filters.sortDir || 'desc', Validators.required
      ]
    });
  }

  save() {
    this.modalController.dismiss({
      sortOptions: this.fg.value
    });
  }

  cancel() {
    this.modalController.dismiss();
  }

  clearAll() {
    this.fg.reset();
  }
}
