import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup = new FormGroup({        //here we create new object of FormGroup
    email:new FormControl(null,[Validators.email, Validators.required]),
    username:new FormControl(null,[Validators.required]),
    password:new FormControl(null,[Validators.required]),
    cpass:new FormControl(null,[Validators.required])
  });

  constructor(private _router : Router, private _users: UserService) { }

  ngOnInit() {
  }

  moveToLogin(){
    this._router.navigate(['/login']);
  }

  register(){
    if(!this.registerForm.valid || (this.registerForm.controls.password.value !=this.registerForm.controls.cpass.value)){
      console.log('Invalid Form');
      return;
    }
    this._users.register(JSON.stringify(this.registerForm.value))
    .subscribe(
      data=>{
        console.log(data);
        this._router.navigate(['/login']);
      },
       error=>console.log(error)
    )
    // console.log(JSON.stringify(this.registerForm.value));
  }

}
