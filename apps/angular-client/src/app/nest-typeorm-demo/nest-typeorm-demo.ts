import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Api, ICond, IEmail, IPeople } from './api';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-nest-typeorm-demo',
  imports: [
    MatDividerModule,
    MatListModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <div>totalCount: {{ totalCount() }}</div>

    <mat-list>
      @for (people of peopleList(); track people.id) {
      <mat-list-item>
        <div matListItemTitle>id: {{ people.id }}, name: {{ people.name }}, age: {{ people.age }}</div>
        <div matListItemLine>emailList</div>
        <mat-list>
          @for (email of people.emailList; track $index) {
          <mat-list-item matListItemLine>{{ email.addr }}</mat-list-item>
          } @empty {
          <mat-list-item matListItemLine>Empty emailList</mat-list-item>
          }
        </mat-list>
      </mat-list-item>
      } @empty {
      <mat-list-item>Empty peopleList</mat-list-item>
      }
    </mat-list>

    <mat-divider />

    <form>
      <mat-form-field>
        <mat-label>peopleFormData().id</mat-label>
        <input
          matInput
          placeholder="id"
          type="number"
          [value]="peopleFormData().id"
          (change)="handlePeopleFormIdChange($event)"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>peopleFormData().name</mat-label>
        <input
          matInput
          placeholder="name"
          [value]="peopleFormData().name"
          (change)="handlePeopleFormNameChange($event)"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>peopleFormData().age</mat-label>
        <input
          matInput
          placeholder="age"
          type="number"
          [value]="peopleFormData().age"
          (change)="handlePeopleFormAgeChange($event)"
        />
      </mat-form-field>
    </form>

    <button matButton="elevated" (click)="insertPeople()">insertPeople</button>
    <button matButton="elevated" (click)="updatePeople()">updatePeople</button>

    <mat-divider />

    <form>
      <mat-form-field>
        <mat-label>condFormData().partialName</mat-label>
        <input
          matInput
          placeholder="partialName"
          [value]="condFormData().partialName"
          (change)="handleCondFormPartialNameChange($event)"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>condFormData().page</mat-label>
        <input
          matInput
          placeholder="page"
          [value]="condFormData().page"
          type="number"
          (change)="handleCondFormPageChange($event)"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>condFormData().pageSize</mat-label>
        <input
          matInput
          placeholder="pageSize"
          [value]="condFormData().pageSize"
          type="number"
          (change)="handleCondFormPageSizeChange($event)"
        />
      </mat-form-field>
    </form>

    <button matButton="elevated" (click)="fetchPeopleList()">fetchPeopleList</button>
    <button matButton="elevated" (click)="resetCondFormData()">resetCondFormData</button>

    <mat-divider />

    <form>
      <mat-form-field>
        <mat-label>emailFormData().peopleId</mat-label>
        <input
          type="number"
          matInput
          placeholder="peopleId"
          [value]="emailFormData().peopleId"
          (change)="handleEmailFormPeopleIdChange($event)"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>emailFormData().addr</mat-label>
        <input
          matInput
          placeholder="addr"
          [value]="emailFormData().addr"
          (change)="handleEmailFormAddrChange($event)"
        />
      </mat-form-field>
    </form>

    <button matButton="elevated" (click)="addPeopleEmail()">addPeopleEmail</button>

    <mat-divider />

    <form>
      <mat-form-field>
        <mat-label>emailAddr</mat-label>
        <mat-select [(value)]="emailAddr">
          @for (addr of computedEmailAddrList(); track $index) {
          <mat-option (value)="(addr)">{{ addr }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>emailAddr2</mat-label>
        <mat-select [(value)]="emailAddr2">
          @for (addr of computedEmailAddrList(); track $index) {
          <mat-option (value)="(addr)">{{ addr }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </form>

    <button matButton="elevated" (click)="swapEmailAddr()">
      swapEmailAddr {{ emailAddr() }} {{ emailAddr2() }}
    </button>
  `,
})
export class NestTypeormDemo implements OnInit {
  ngOnInit() {
    this.fetchPeopleList();
  }
  api = inject<Api>(Api);

  totalCount = signal<number>(0);
  peopleList = signal<IPeople[]>([]);

  emailAddr = signal<string>('<emailAddr>');
  emailAddr2 = signal<string>('<emailAddr2>');

  peopleFormData = signal<IPeople>({
    id: 0,
    name: 'lark',
    age: 23,
  });
  condFormData = signal<ICond>({
    partialName: '',
    page: 1,
    pageSize: 10,
  });
  emailFormData = signal<IEmail>({
    peopleId: 0,
    addr: '',
  });

  resetPeopleFormData() {
    this.peopleFormData.set({
      id: 0,
      name: 'lark',
      age: 23,
    });
  }

  resetCondFormData() {
    this.condFormData.set({
      partialName: '',
      page: 1,
      pageSize: 10,
    });
    this.fetchPeopleList();
  }

  resetEmailFormData() {
    this.emailFormData.set({
      peopleId: 0,
      addr: '',
    });
  }

  insertPeople() {
    this.api.insertPeople(this.peopleFormData()).subscribe({
      next: (res) => {
        console.log('[insertPeople] res:', res);
        this.resetPeopleFormData();
        this.fetchPeopleList();
      },
      error: console.log,
    });
  }

  updatePeople() {
    this.api.updatePeople(this.peopleFormData()).subscribe({
      next: (res) => {
        console.log('[updatePeople] res:', res);
        this.resetPeopleFormData();
      },
      error: console.log,
    });
  }

  deletePeople(id: number) {
    this.api.deletePeople(id).subscribe({
      next: (res) => {
        console.log('[deletePeople] res:', res);
        this.fetchPeopleList();
      },
      error: console.log,
    });
  }

  addPeopleEmail() {
    this.api.addPeopleEmail(this.emailFormData()).subscribe({
      next: (res) => {
        console.log('[addPeopleEmail] res:', res);
        this.resetEmailFormData();
      },
      error: console.log,
    });
  }

  fetchPeopleList() {
    this.api.fetchPeopleList(this.condFormData()).subscribe({
      next: (res) => {
        console.log('[fetchPeopleList] res:', res);
        const data = res.data as {
          peopleList: IPeople[];
          totalCount: number;
        };
        this.peopleList.set(data.peopleList);
        this.totalCount.set(data.totalCount);
      },
      error: console.log,
    });
  }

  computedEmailAddrList = computed(() => {
    const emailAddrList = [];
    for (const people of this.peopleList()) {
      const addrList = people.emailList?.map((email) => email.addr) ?? [];
      emailAddrList.push(...addrList);
    }
    return emailAddrList;
  });

  swapEmailAddr() {
    this.api.swapEmailAddr([this.emailAddr(), this.emailAddr2()]).subscribe({
      next: (res) => {
        console.log('[swapEmailAddr] res:', res);
        this.emailAddr.set('<emailAddr>');
        this.emailAddr2.set('<emailAddr2>');
        this.fetchPeopleList();
      },
      error: console.log,
    });
  }

  handlePeopleFormIdChange(e: Event) {
    const newId = (e.target as HTMLInputElement).value;
    this.peopleFormData.update((data) => ({
      ...data,
      id: Number.parseInt(newId, 10),
    }));
  }

  handlePeopleFormNameChange(e: Event) {
    const newName = (e.target as HTMLInputElement).value;
    this.peopleFormData.update((data) => ({
      ...data,
      name: newName,
    }));
  }

  handlePeopleFormAgeChange(e: Event) {
    const newAge = (e.target as HTMLInputElement).value;
    this.peopleFormData.update((data) => ({
      ...data,
      age: Number.parseInt(newAge, 10),
    }));
  }

  handleCondFormPartialNameChange(e: Event) {
    const newPartialName = (e.target as HTMLInputElement).value;
    this.condFormData.update((data) => ({
      ...data,
      partialName: newPartialName,
    }));
  }

  handleCondFormPageChange(e: Event) {
    const newPage = (e.target as HTMLInputElement).value;
    this.condFormData.update((data) => ({
      ...data,
      page: Number.parseInt(newPage, 10),
    }));
  }

  handleCondFormPageSizeChange(e: Event) {
    const newPageSize = (e.target as HTMLInputElement).value;
    this.condFormData.update((data) => ({
      ...data,
      pageSize: Number.parseInt(newPageSize, 10),
    }));
  }

  handleEmailFormPeopleIdChange(e: Event) {
    const newPeopleId = (e.target as HTMLInputElement).value;
    this.emailFormData.update((data) => ({
      ...data,
      peopleId: Number.parseInt(newPeopleId, 10),
    }));
  }

  handleEmailFormAddrChange(e: Event) {
    const newAddr = (e.target as HTMLInputElement).value;
    this.emailFormData.update((data) => ({
      ...data,
      addr: newAddr,
    }));
  }
}
