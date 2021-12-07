import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../services/user.service';
import ProductModel from 'src/app/models/product.model';
import { NotifyService } from 'src/app/services/notify.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public products: ProductModel[];

  constructor(private myUserService: UserService, private notify: NotifyService) { }

  async ngOnInit() {
    try {
      this.products = await this.myUserService.getProducts();
      // this.products = await this.myUserService.getProducts();
  }
  catch (err) {
      this.notify.error(err);
  }
  }

}
