import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SupervisorsService} from './services/supervisors.service';
import {SubmitService} from './services/submit.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  supervisor = '';
  supervisors = [];
  validateEmail = true;

  constructor(
    private _supervisorService: SupervisorsService,
    private _submitService: SubmitService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getSupervisors();
  }

  getSupervisors(): void {
    this._supervisorService.getMany({}).subscribe({
      next: (d) => this.handleGetSupervisors(d),
      error: (e) => this.handleGetSupervisorsError(e)
    });
  }

  submit(): void {
    const phoneRegEx = /\D/ig;
    let phoneNumber = this.phoneNumber.replace(phoneRegEx, "");

    if (phoneNumber.length === 10) {
      phoneNumber = "+1" + this.phoneNumber.replace(phoneRegEx, '');
    } else if (this.phoneNumber.length > 0 && this.phoneNumber.length < 10) {
      this._snackbar.open('If including a phone number, it must be valid.');
    }
    const params = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: phoneNumber,
      supervisor: this.supervisor,
      email: this.email
    }
    this._submitService.add(params).subscribe({
      next: (d) => this.handleAddSubmit(d),
      error: (e) => this.handleAddSubmitError(e)
    });
  }

  formatPhone(event: any): void {
    let newVal = event.target.value.replace(/\D/g, '');
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2-');
    } else if (newVal.length <= 9) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }
    event.target.value = newVal;
    this.phoneNumber = newVal;
  }

  handleGetSupervisors(d: any): void {
    this.supervisors = d.results;
  }

  handleGetSupervisorsError(e: any): void {
    this.supervisors = [];
    this._snackbar.open(e.error.message)
  }

  handleAddSubmit(d: any): void {
    this._snackbar.open('Successfully submitted the notification. Check your docker console!');
    this.firstName = '';
    this.lastName = '';
    this.phoneNumber = '';
    this.email = '';
    this.supervisor = '';
  }

  handleAddSubmitError(e: any): void {
    this._snackbar.open(e.error.message);
    console.log(e);
  }
}
