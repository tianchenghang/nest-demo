import { Component, signal, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

function download(data: ArrayBuffer | Blob, filename: string) {
  const blob = new Blob([data]);
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

@Component({
  selector: 'app-nest-demo',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatDividerModule,
  ],
  template: `
    <div>
      <mat-form-field>
        <mat-label>username</mat-label>
        <input matInput [(ngModel)]="username" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>password</mat-label>
        <input matInput [(ngModel)]="password" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>captcha</mat-label>
        <input matInput [(ngModel)]="captchaText" />
      </mat-form-field>

      <div [innerHTML]="captchaData()" (click)="getCaptcha()"></div>
      <button matButton="elevated" (click)="handleSubmit()">Submit</button>

      <input type="file" (change)="handleInputFile($event)" />
      <button matButton="elevated" (click)="handleUpload()">Upload</button>

      <ul>
        @for (item of uploadedItems(); track item) {
        <li>{{ item }}</li>
        } @empty { Empty Uploaded Items }
      </ul>

      <mat-divider />

      <mat-form-field>
        <mat-label>filename</mat-label>
        <input matInput placeholder="filename" [(ngModel)]="filename" />
      </mat-form-field>
      <button matButton="elevated" (click)="handleDownload()">Download</button>
      <button matButton="elevated" (click)="handleStreamDownload()">Stream Download</button>
    </div>
  `,
  styles: ``,
})
export class NestDemo implements OnInit {
  ngOnInit() {
    this.getCaptcha();
  }
  username = signal<string>('');
  password = signal<string>('');
  captchaData = signal<SafeHtml>('');
  captchaText = signal<string>('');
  captchaUrl = signal<string>('/api/v1/user/captcha');
  uploadedFile = signal<File | null>(null);
  uploadedItems = signal<string[]>([]);
  filename = signal<string>('');

  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  getCaptcha() {
    this.http
      .get('/api/v1/user/captcha', {
        responseType: 'text',
      })
      .subscribe((newCaptchaData) => {
        const safeHtml = this.sanitizer.bypassSecurityTrustHtml(newCaptchaData);
        this.captchaData.set(safeHtml);
      });
  }

  handleSubmit() {
    this.http
      .post('/api/v1/user/create', {
        username: this.username(),
        password: this.password(),
        captcha: this.captchaText(),
      })
      .subscribe((res) => {
        console.log(res);
      });
  }

  handleInputFile(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.uploadedFile.set(files[0]);
    }
  }

  handleUpload() {
    if (!this.uploadedFile()) {
      return;
    }
    const formData = new FormData();
    formData.append('entity', this.uploadedFile()!);
    this.http
      .post<{
        file: IFile;
        items: string[];
      }>('/api/v1/upload/single', formData)
      .subscribe(({ file, items }) => {
        const { filename } = file;
        this.filename.set(filename);
        this.uploadedItems.set(items);
      });
  }

  async handleDownload() {
    const blobPart = await fetch(`/api/v1/upload/download?filename=${this.filename()}`).then(
      (res) => res.blob()
    );
    download(blobPart, this.filename());
  }

  async handleStreamDownload() {
    const buf = await fetch(`/api/v1/upload/stream?filename=${this.filename()}`).then((res) =>
      res.arrayBuffer()
    );
    download(buf, this.filename() + '.zip');
  }
}
