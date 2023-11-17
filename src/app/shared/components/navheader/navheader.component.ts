import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service'; // Servicio de autenticación

@Component({
  selector: 'app-navheader',
  templateUrl: './navheader.component.html',
  styleUrls: ['./navheader.component.css']
})
export class NavheaderComponent implements OnInit, OnDestroy {
  private modalDataSubscription!: Subscription;
  private modalDataSubscription2!: Subscription;

  userName!: string | null;
  pfp!: string;
  expanded = false;
  expanded2 = "cerrado";
  adminButton = false;
  userButton = false;
  displayName!: string | null;

  constructor(
    private router: Router,
    private modalService: ModalServiceService,
    private authService: AuthService // Inyección del servicio de autenticación
  ) {}

  ngOnInit() {
    this.setupAuthListener();
    this.setupModalSubscriptions();
  }

  private setupAuthListener() {
    this.authService.onAuthStateChanged((user, userDetails) => {
      if (user) {
        this.userButton = true;
        this.displayName = user.displayName;
        this.userName = userDetails.userName;
        this.pfp = user.photoURL;
        if (userDetails.rol === "admin" || userDetails.rol === "superadmin") {
          this.adminButton = true;
        }else{
          this.adminButton = false;
        }
        console.log(userDetails)
      }
    });
  }

  private setupModalSubscriptions() {
    this.modalDataSubscription = this.modalService.modalPFHeader$.subscribe(value => {
      this.expanded2 = value ? "abierto" : "cerrado";
    });
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    this.expanded2 = this.expanded ? "cerrado" : "abierto";
  }

  logOut() {
    this.authService.logout()
      .then(() => this.router.navigate(['/auth/login']))
      .catch(error => console.error('Error logging out:', error));
  }

  navigate() {
    const userToNavigate = this.userName || localStorage.getItem('cachedUserName');
    this.router.navigate(['/profile', userToNavigate]);
  }

  navigateAdmin() {
    if (this.adminButton) {
      this.router.navigate(['/dashboard-admin']);
    }
  }

  ngOnDestroy() {
    this.modalDataSubscription.unsubscribe();
    if (this.modalDataSubscription2) {
      this.modalDataSubscription2.unsubscribe();
    }
  }
}
