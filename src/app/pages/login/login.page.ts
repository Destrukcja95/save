import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { auth } from 'firebase';

enum AuthType {
  SIGNIN = 'Sign in',
  SIGNUP = 'Sign up'
}

@Component({
  selector: 'app-signup',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authType = AuthType.SIGNUP;
  firebaseAuthErrorMessage: string;
  form: FormGroup;

  validationMessages = [
    { inputName: 'email', type: 'required', message: 'Email is required.' },
    { inputName: 'email', type: 'pattern', message: 'Enter a valid email.' },
    { inputName: 'password', type: 'required', message: 'Password is required.' },
    { inputName: 'password', type: 'minlength', message: 'Password must be at least 6 characters long.' }
  ];

  constructor(
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    public menuCtrl: MenuController
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.menuCtrl.enable(false);
  }

  async loginByEmail() {
    await this.tryAuthByEmail();
    await this.goToAppAndEnableMenu();
  }

  async loginByGoogle() {
    await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    await this.goToAppAndEnableMenu();
  }

  async goToAppAndEnableMenu() {
    await this.menuCtrl.enable(true);
    await this.navCtrl.navigateRoot('/categories');
  }

  formControlHasError(formName: string, errorType: string) {
    const controller = this.form.get(formName);
    return controller.hasError(errorType)
      && (controller.dirty || controller.touched);
  }

  changeAuthType() {
    this.authType = this.authType === AuthType.SIGNUP
      ? AuthType.SIGNIN
      : AuthType.SIGNUP;
  }

  typeIsSignUp() {
    return this.authType === AuthType.SIGNUP;
  }

  getOtherAuthType() {
    return this.authType === AuthType.SIGNUP
      ? AuthType.SIGNIN
      : AuthType.SIGNUP;
  }

  private async tryAuthByEmail() {
    const { email, password } = this.form.value;

    try {
      await this.authByEmail(email, password);
    } catch (e) {
      this.firebaseAuthErrorMessage = e.message;
      throw e;
    }
  }

  private async authByEmail(email, password) {
    if (this.authType === AuthType.SIGNUP) {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    } else {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }
}
