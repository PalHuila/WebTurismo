
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { Subscription } from 'rxjs';
import { getAuth, onAuthStateChanged, } from '@angular/fire/auth';
import { doc, getDoc, getFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-navheader',
  templateUrl: './navheader.component.html',
  styleUrls: ['./navheader.component.css']
})

export class NavheaderComponent implements OnInit{

  private modalDataSubscription!: Subscription;
  private modalDataSubscription2!: Subscription;
  auth = getAuth();
  uid!: string | null;
  userName!: string | null;
  pfp!: string;
  expanded?:boolean
  expanded2?:string;
  dataUser: any;
  adminButton = false;
  UserName!:string | null;
  loading = false;

  toggleExpanded() {
    this.expanded = this.expanded == true ? this.expanded = false : this.expanded = true;

    this.expanded2 = "cerrado"
  }

  toggleExpanded2() {
    console.log(this.expanded2)
    if(this.expanded2 === "cerrado"){
      this.expanded2 = "abierto"
    }
    else{
      this.expanded2 = "cerrado"
    }
    this.expanded = false; // Asegura que expanded esté en false cuando expanded2 cambie
  }



  constructor(private userService: UserService, private router: Router,   private modalService: ModalServiceService,){

    this.UserName = this.auth.currentUser!.displayName;
  }

  logOut() {
    this.userService.update().then(()=>{
      this.userService.cerrarSesion().then(()=>{this.router.navigate(['/auth/login']);}).catch((error)=>{console.log(error)})
     }).catch((error)=>{console.log(error)})

  }


  navigate(){


        this.router.navigate(['/profile', this.userName]);

  }

  navigateAdmin(){

        this.router.navigate(['/dashboard-admin']);


  }


  ngOnInit(){

    this.modalDataSubscription = this.modalService.modalPFHeader$.subscribe((value) => {

      if(value === true){
        this.expanded2 === "abierto" || null ? this.expanded2 = "cerrado" : this.expanded2 = "abierto";
      }
      else{
        this.expanded2 = "cerrado"
      }
    });


    this.modalDataSubscription2 = this.userService.rolSubject$.subscribe((value) => {
      if(value === "admin" || value === "superadmin"){
        this.adminButton = true;

      }

    });


    this.obtenerfoto();

    this.obtenerUsuario().then(()=>{":D"});

    } ;

    async obtenerUsuario(){
      const firestore = getFirestore();
      const docRef = doc(firestore, 'users', this.auth.currentUser!.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        this.userName = docSnap.data()['userName'];
      }



    }


    obtenerfoto(){
      if(this.auth.currentUser!.photoURL !== null && this.loading === false){
        this.pfp = this.auth.currentUser!.photoURL!;

        this.loading = true;

      }
    }


    ngOnDestroy() {
      if (this.modalDataSubscription) {
        this.modalDataSubscription.unsubscribe();
      }
      if (this.modalDataSubscription2) {
        this.modalDataSubscription2.unsubscribe();
      }

    }


}

