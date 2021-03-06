import { Component, OnInit, EventEmitter } from '@angular/core';
import { RouterAuthService } from 'src/app/core/services/router-auth.service';
import { Router } from '@angular/router';
import { NetworkService } from 'src/app/core/services/network.service';
import { Observable, concat, noop, from, throwError } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { PopoverController } from '@ionic/angular';
import { SignUpErrorComponent } from './error/error.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  isFreeDomainEmail = false;
  isValidEmail = false;
  isConnected$: Observable<boolean>;
  userEmail: string;

  constructor(
    private routerAuthService: RouterAuthService,
    private networkService: NetworkService,
    private router: Router,
    private loaderService: LoaderService,
    private popoverController: PopoverController
  ) { }

  async ngOnInit() {
    const networkWatcherEmitter = new EventEmitter<boolean>();
    this.networkService.connectivityWatcher(networkWatcherEmitter);
    this.isConnected$ = concat(this.networkService.isOnline(), networkWatcherEmitter.asObservable());
    this.isConnected$.subscribe(noop);

    const isLoggedIn = await this.routerAuthService.isLoggedIn();

    if (isLoggedIn) {
      this.router.navigate(['/', 'auth', 'switch-org', { choose: false }]);
    }
  }

  onEmailChange(event) {
    const email = event.srcElement.value;
    this.isFreeDomainEmail = false;
    this.isValidEmail = RegExp('\\S+@\\S+\\.\\S{2,}').test(email);
    if (this.isValidEmail) {
      this.isFreeDomainEmail = this.routerAuthService.checkIfFreeDomain(email);
    }
  }

  async handleError(err) {
    let title = 'Unable to Signup';

    if (err.status === 400) {
      title = 'Invitation Required!';
    } else if (err.status === 500) {
      title = 'Something Bad Happened';
    }

    const errorPopover = await this.popoverController.create({
      component: SignUpErrorComponent,
      componentProps: {
        header: title,
        status: err.status,
        email: this.userEmail
      },
      cssClass: 'error-popover'
    });

    await errorPopover.present();
  }

  signUpUser() {
    from(this.loaderService.showLoader()).pipe(
      switchMap(() => {
        return this.routerAuthService.canSignup(this.userEmail);
      }),
      tap(() => {
        // TODO: Add with tracking service
        // TrackingService.canSignup(vm.email, 'mobile', { Asset: 'Mobile' });
      }),
      finalize(async () => {
        await this.loaderService.hideLoader();
      }),
      catchError((err) => {
        this.handleError(err);
        return throwError(err);
      })
    ).subscribe(() => {
      this.router.navigate(['/', 'pre_verification', 'signup_details_enterprise', { email: this.userEmail }]);
    });
  }
}
