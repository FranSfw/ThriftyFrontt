import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, ProductCategory } from '../login/user.model';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './create-product.component.html',
  styles: ``
})
export class CreateProductComponent {
  // Product model
  product: Product = {
    id: 2, // This will be assigned by the backend
    productName: 'TP Vainilla',
    description: 'Vainilla familiar',
    category: ProductCategory.THRIFTY_PACK, // Default category
    initialQuantity: 3,
    imageSrc: 'https://calimaxmx.vtexassets.com/arquivos/ids/179868/080328000296.jpg?v=637280107242130000',
    addedAt: new Date(),
    branchId: 2 // Default branch ID, you might want to make this dynamic
  };

  // For form handling
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  categories = Object.values(ProductCategory);
  
  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  // Method to create a new product
  createNewProduct(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validate required fields based on backend requirements
    if (!this.product.productName) {
      this.errorMessage = 'Product name is required';
      this.isLoading = false;
      return;
    }

    if (!this.product.category) {
      this.errorMessage = 'Category is required';
      this.isLoading = false;
      return;
    }

    if (this.product.initialQuantity === undefined || this.product.initialQuantity === null) {
      this.errorMessage = 'Initial quantity is required';
      this.isLoading = false;
      return;
    }

    if (!this.product.branchId) {
      this.errorMessage = 'Branch is required';
      this.isLoading = false;
      return;
    }

    // Set the added date to current time
    this.product.addedAt = new Date();

    // Create the product payload
    const productPayload: Product = {
      id: this.product.id,
      productName: this.product.productName,
      description: this.product.description,
      category: this.product.category,
      initialQuantity: this.product.initialQuantity,
      branchId: this.product.branchId,
      imageSrc: this.product.imageSrc,
      addedAt: this.product.addedAt
    };

    this.productService.createProduct(productPayload).subscribe({
      next: (response) => {
        console.log('Product created successfully:', response);
        this.successMessage = 'Product created successfully!';
        this.isLoading = false;
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.errorMessage = error.error?.message || 'Failed to create product. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Add this helper method to reset the form after successful submission
  private resetForm(): void {
    this.product = {
      id: 0,
      productName: '',
      description: '',
      category: ProductCategory.THRIFTY_PACK, 
      initialQuantity: 0,
      branchId: 0,
      imageSrc: '',
      addedAt: new Date()
    };
  }
}
