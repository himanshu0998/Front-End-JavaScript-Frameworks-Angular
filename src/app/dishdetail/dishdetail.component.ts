import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { visibility, flyInOut, expand } from '../animations/app.animations';

import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
// import { timeStamp } from 'console';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display: block;'
  },
  animations: [
      visibility(),
      flyInOut(),
      expand()
  ]
})


export class DishdetailComponent implements OnInit {

  // @Input()
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  matslider: number = 5;
  errMess: string;
  dishcopy: Dish;
  visibility = 'shown';

  commentForm: FormGroup;
  comment: Comment;

  @ViewChild('cform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment':''
  };

  validationMessages = {
    'author': {
      'required':'First name is required',
      'minlength':'First name must be at least 2 characters long',
      'maxlength':'First name cannot be more than 25 characters'
    },
    'comment': {
      'required':'Comment is required.',
    }
  };

  constructor(private dishService: DishService,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) {
     }
    
  ngOnInit(): void {
    this.createForm();
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params)=>{
        this.visibility='hidden';
        return this.dishService.getDish(params['id']);
      }))
      .subscribe((dish)=> { 
        this.dish = dish; 
        this.dishcopy = dish;
        this.setPrevNext(this.dish.id);
        this.visibility = 'shown';
      },
      (error)=>{this.errMess = <any>error}
    ); 
  }

  createForm()
  {
    this.commentForm = this.fb.group({
      author:['',[Validators.required, Validators.minLength(2)]],
      comment:['', Validators.required],
      rating: 5
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    
    this.onValueChanged();
  }

  onValueChanged(data?: any)
  {
    if(!this.commentForm){return;}
    const form = this.commentForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.formErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit()
  {
    this.comment = this.commentForm.value;
    this.comment.rating = this.matslider;
    this.comment.date =new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
          this.dish = dish;
          this.dishcopy = dish;
      },
      errMess => {
        this.dish = null;
        this.dishcopy = null;
        this.errMess = <any>errMess;
      });
    this.matslider = 5;
    console.log(this.comment);
    this.commentForm.reset({
      author: '',
      comment:'',
      rating: 5,
    });
    this.commentFormDirective.resetForm();
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() {
    this.location.back();
  }

}
