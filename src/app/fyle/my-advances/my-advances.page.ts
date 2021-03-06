import { Component, OnInit } from '@angular/core';
import { forkJoin, from, noop, Observable, Subject } from 'rxjs';
import { concatMap, finalize, map, scan, shareReplay, switchMap } from 'rxjs/operators';
import { ExtendedAdvanceRequest } from 'src/app/core/models/extended_advance_request.model';
import { AdvanceRequestService } from 'src/app/core/services/advance-request.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { OfflineService } from 'src/app/core/services/offline.service';

@Component({
  selector: 'app-my-advances',
  templateUrl: './my-advances.page.html',
  styleUrls: ['./my-advances.page.scss'],
})
export class MyAdvancesPage implements OnInit {

  myAdvancerequests$: Observable<any[]>;
  loadData$: Subject<number> = new Subject();
  count$: Observable<number>;
  currentPageNumber = 1;
  isInfiniteScrollRequired$: Observable<boolean>;

  constructor(
    private offlineService: OfflineService,
    private advanceRequestService: AdvanceRequestService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.myAdvancerequests$ = this.loadData$.pipe(
      concatMap(pageNumber => {
        return from(this.loaderService.showLoader()).pipe(
          switchMap(() => {
            return this.advanceRequestService.getMyadvanceRequests({
              offset: (pageNumber - 1) * 10,
              limit: 10,
              queryParams: {areq_trip_request_id: 'is.null', order: 'areq_created_at.desc,areq_id.desc'}
            });
          }),
          finalize(() => {
            return from(this.loaderService.hideLoader());
          })
        );
      }),
      map(res => res.data),
      scan((acc, curr) => {
        if (this.currentPageNumber === 1) {
          return curr;
        }
        return acc.concat(curr);
      }, [] as ExtendedAdvanceRequest[]),
      shareReplay()
    );

    this.count$ = this.advanceRequestService.getMyAdvanceRequestsCount().pipe(
      shareReplay()
    );

    this.isInfiniteScrollRequired$ = this.myAdvancerequests$.pipe(
      concatMap(myAdvancerequests => {
        return this.count$.pipe(map(count => {
          return count > myAdvancerequests.length;
        }));
      })
    );

    this.loadData$.subscribe(noop);
    this.myAdvancerequests$.subscribe(noop);
    this.count$.subscribe(noop);
    this.isInfiniteScrollRequired$.subscribe(noop);
    this.loadData$.next(this.currentPageNumber);
  }

  loadData(event) {
    this.currentPageNumber = this.currentPageNumber + 1;
    this.loadData$.next(this.currentPageNumber);
    event.target.complete();
  }

  doRefresh(event) {
    this.currentPageNumber = 1;
    this.loadData$.next(this.currentPageNumber);
    event.target.complete();
  }

}
