import 'zone.js/dist/zone';
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="logo"></div>
      <div class="tc-container">

        <form class="tc-form">
          <p class="tc-form__label">Bill</p>
          <input
            #billAmountField
            type="number"
            class="tc-form__input--dollar"
            placeholder="0"
            min="0"
            max="1000000"
            step="0.01"
            oninput="validity.valid || (value='')"
            [value]="billAmount()"
            (input)="billAmount.set(Number(billAmountField.value))"
          >

          <p class="tc-form__label mt-25">Select Tip %</p>
          <div class="tc-form__tip-selector">
            <button
              *ngFor="let tip of tips()"
              (click)="selectTip(tip)"
              class="btn"
              [class.active]="selectedTip() === tip"
            >{{ tip }}%
            </button>

            <input
              #customTipField
              type="number"
              class="tc-form__input"
              placeholder="Custom"
              min="0"
              max="1000"
              oninput="validity.valid || (value='')"
              [value]="customTip()"
              (input)="setCustomTip(Number(customTipField.value))"
            >
          </div>

          <p class="tc-form__label d-ib mt-25">Number of People</p>
          <span *ngIf="numberOfPeople() === 0" class="tc-form__error mt-25">Can't be zero</span>
          <input
            #numberOfPeopleField
            type="number"
            class="tc-form__input--person"
            [class.error]="numberOfPeople() === 0"
            placeholder="0"
            min="0"
            max="1000"
            oninput="validity.valid || (value='')"
            [value]="numberOfPeople()"
            (input)="numberOfPeople.set(Number(numberOfPeopleField.value))"
          >
        </form>

        <div class="tc-results">
          <div class="tc-results__result">
            <p>Tip Amount <span>/ person</span></p>
            <h1
              [ngClass]="textSizeTip()"
            >$<span>{{ tipAmountPerPerson() | number: '1.2-2' }}</span></h1>
          </div>

          <div class="tc-results__result">
            <p>Total <span>/ person</span></p>
            <h1 [class]="textSizeTotal()">$<span>{{ totalPerPerson() | number: '1.2-2' }}</span></h1>
          </div>

          <button class="btn active" (click)="reset()">Reset</button>
        </div>

      </div>
    </div>
  `,
})
export class App {

  protected readonly Number = Number;

  billAmount = signal<number>(0);
  customTip = signal<number>(null);
  numberOfPeople = signal<number>(1);

  tips = signal<number[]>([5, 10, 15, 25, 50]);
  selectedTip = signal<number>(null);

  tipAmountPerPerson = computed(() => this.billAmount() * (this.tip / 100) / this.numberOfPeople());
  totalPerPerson = computed(() => this.billAmount() * (1 + (this.tip / 100)) / this.numberOfPeople());

  textSizeTip = computed(() => this.setTextSize(this.tipAmountPerPerson()));
  textSizeTotal = computed(() => this.setTextSize(this.totalPerPerson()));

  get tip(): number {
    return this.selectedTip() ? this.selectedTip() : this.customTip();
  }

  setTextSize(length: number): string {
    length = Math.floor(length).toString().length;

    if (length > 6) {
      return 'text-15';
    } else if (length > 4) {
      return 'text-2';
    }

    return '';
  }

  selectTip(tip: number): void {
    this.selectedTip.set(tip);
    this.customTip.set(null);
  }

  setCustomTip(tip: number): void {
    this.customTip.set(tip);
    this.selectedTip.set(null);
  }

  reset(): void {
    this.billAmount.set(0);
    this.customTip.set(null);
    this.numberOfPeople.set(1);
    this.selectedTip.set(null);
  }
}

bootstrapApplication(App).then(() => {
  console.log('Application is running!');
});
