import { Component } from '@angular/core';
import { NestTypeormDemo } from './nest-typeorm-demo/nest-typeorm-demo';
@Component({
  selector: 'app-root',
  imports: [NestTypeormDemo],
  template: `
    <!-- <app-nest-demo /> -->
    <app-nest-typeorm-demo />
  `,
})
export class App {}
