import { Component, OnInit , Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { Promotion } from '../shared/promotion';
import { Leader } from '../shared/leader';

import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { flyInOut,expand } from '../animations/app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  dishErrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;
  promotion: Promotion;
  leader: Leader;

  constructor(private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
    .subscribe((dish) => {this.dish = dish},
      (error)=>{this.dishErrMess = <any>error}
    );
    console.log(this.dish);
    this.promotionService.getFeaturedPromotion()
    .subscribe((promo) => {this.promotion = promo},
    (error)=>{this.promotionErrMess = <any>error}
    );
    console.log(this.promotion);
    this.leaderService.getFeaturedLeader()
    .subscribe((leader) => {this.leader = leader},
    (error)=>{this.leaderErrMess = <any>error}
    );
    console.log(this.promotion);
  }

}
