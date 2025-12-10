import { Observable, Subscription, interval, retry, of } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';

// pnpm test src/app.spec.ts
describe('app tests', () => {
  // pnpm test src/app.spec.ts --testNamePattern="rxjs test"
  it('rxjs test', (done) => {
    const observable = new Observable((subscribe) => {
      subscribe.next(0);
      subscribe.next(1);

      setTimeout(() => {
        subscribe.next(2);
        subscribe.complete();
      }, 3000);
    });

    observable.subscribe({
      next: console.log,
      complete: () => {
        console.log('Done!');
        done();
      },
    });
  }, 5000 /** timeout */);

  // pnpm test src/app.spec.ts --testNamePattern="rxjs test2"
  it('rxjs test2', (done) => {
    interval(1000)
      .pipe(take(3))
      .subscribe({
        next: console.log,
        complete: () => {
          console.log('Done!');
          done();
        },
      });
  }, 5000);

  // pnpm test src/app.spec.ts --testNamePattern="rxjs test3"
  it('rxjs test3', (done) => {
    const subscription = interval(1000)
      .pipe(
        map((item) => ({ val: item })),
        filter((item) => item.val % 2 === 0),
      )
      .subscribe((item) => {
        console.log(item);
        if (item.val >= 2) {
          subscription.unsubscribe();
          done();
        }
      });
  }, 5000);

  // pnpm test src/app.spec.ts --testNamePattern="rxjs test4"
  it('rxjs test4', (done) => {
    const observable = of(0, 1, 2, 3).pipe(
      map((item) => {
        const rand = Math.random();
        if (rand < 0.3) {
          throw new Error(`${rand.toFixed(2)} < 0.3`);
        }
        return { val: item };
      }),
      filter((item) => item.val % 2 === 0),
      retry(3),
      // catchError((err: Error) => {
      //   console.log('[catchError] err:', err.message);
      //   throw err;
      // }),
    );
    const subscription = new Subscription();
    subscription.add(
      observable.subscribe({
        next: (item) => {
          console.log('[subscribe] item:', item);
          if (item.val >= 2) {
            subscription.unsubscribe();
            done();
          }
        },
        error: (err: Error) => {
          console.log('[subscribe] err.message:', err.message);
          done(err.message);
        },
      }),
    );
  }, 5000);
});
