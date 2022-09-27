import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { routes } from '../app-routing.module';
import { AuthGuardGuard } from '../auth-guard.guard';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  title = 'jw-cuentas';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  fillerNav = routes[0].children;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private auth: AngularFireAuth,
    private authService: AuthService,
    private route: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
  async ngOnInit(): Promise<void> {
    this.authService.setUserUid();
  }

  logOut() {
    this.auth.signOut().then(() => this.route.navigate(['/login']));
  }
}
