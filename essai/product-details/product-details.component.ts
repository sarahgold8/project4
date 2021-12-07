import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ProductModel from 'src/app/models/product.model';
import { NotifyService } from 'src/app/services/notify.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {

    public product: ProductModel;

    public imageUrl = environment.productImagesUrl;

    constructor(
        private myActivatedRoute: ActivatedRoute,
        private notify: NotifyService,
        private myRouter: Router,
        private userService: UserService) { }

    async ngOnInit() {
        try {
            const id = this.myActivatedRoute.snapshot.params._id; // Take a route parameter named id.
            // this.product = await this.userService.getProducts(id);
        }
        catch (err) {
            this.notify.error(err);
        }
    }

    public async delete() {
        try {
            const answer = confirm("Are you sure?");
            if (!answer) return;
            // await this.userService.(this.product._id);
            this.notify.success("Product has been deleted.")
            this.myRouter.navigateByUrl("/products");
        }
        catch (err) {
            this.notify.error(err);
        }
    }

}
