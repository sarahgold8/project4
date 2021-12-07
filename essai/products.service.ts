import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import ProductModel from '../models/product.model';
import { productAddedAction, productDeletedAction, productsDownloadedAction, productUpdatedAction } from '../redux/products-state';
import { store } from '../redux/store';
import { ActionType } from '../redux/actionType';


@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    constructor(private http: HttpClient) { }

    // Get all products: 
    public async getAllProducts() {
        if (store.getState().productsState.products.length === 0) {
            const products = await this.http.get<ProductModel[]>(environment.productsUrl).toPromise();
            store.dispatch(productsDownloadedAction(products));
        }
        return store.getState().productsState.products;
    }

    // Get one product: 
    public async getOneProduct(id: string) {
        if (store.getState().productsState.products.length === 0) {
            const products = await this.http.get<ProductModel[]>(environment.productsUrl).toPromise();
            store.dispatch(productsDownloadedAction(products));
        }
        const product = store.getState().productsState.products.find((p: { _id: string; }) => p._id === id);
        return product;
    }

    // Add product: 
    public async addProduct(product: ProductModel) {
        const myFormData: FormData = ProductModel.convertToFormData(product);
        const addedProduct = await this.http.post<ProductModel>(environment.productsUrl, myFormData).toPromise();
        store.dispatch(productAddedAction(addedProduct));
        return addedProduct;
    }

    // Update product: 
    public async updateProduct(product: ProductModel) {
        const myFormData: FormData = ProductModel.convertToFormData(product);
        const updatedProduct = await this.http.put<ProductModel>(environment.productsUrl + product._id, myFormData).toPromise();
        store.dispatch(productUpdatedAction(updatedProduct));
        return updatedProduct;
    }

    // Delete product: 
    public async deleteProduct(id: string) {
        await this.http.delete(environment.productsUrl + id).toPromise();
        store.dispatch(productDeletedAction(id));
    }

    //Search:
    public searchProduct(text: string): Promise<ProductModel[]> {
      return this.http.get<ProductModel[]>(`http://localhost3030/api/user/search/${text}`).toPromise();
    }


    public searchFilteredProduct(text: string, categoryArray: []): Promise<ProductModel[]> {
      return this.http.post<ProductModel[]>(`http://localhost3030/api/user/searchFilteredProduct/${text}`,categoryArray).toPromise();
    }

    //Find products by category:
    public getProductsByCategory(categoryArray: any): Promise<ProductModel[]> {
      return this.http.post<ProductModel[]>(`http://localhost3030/api/user/getProductsByCategory`,categoryArray).toPromise();
    }

}