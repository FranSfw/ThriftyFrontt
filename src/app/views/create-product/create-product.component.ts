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
  styles: ``,
})
export class CreateProductComponent {
  // Product model
  product: Product = {
    id: 0, // This will be assigned by the backend
    productName: '',
    description: '',
    category: ProductCategory.DRINKS, // Default category
    initialQuantity: 0,
    imageSrc: '',
    addedAt: new Date(),
    branchId: 1, // Default branch ID, you might want to make this dynamic
  };

  // For form handling
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  categories = Object.values(ProductCategory);

  constructor(private productService: ProductService, private router: Router) {}

  // Method to create a new product
  createNewProduct(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validate required fields
    if (!this.product.productName) {
      this.errorMessage = 'Product name is required';
      this.isLoading = false;
      return;
    }

    // Set the added date to current time
    this.product.addedAt = new Date();

    this.productService.createProduct(this.product).subscribe({
      next: (response) => {
        console.log('Product created successfully:', response);
        this.successMessage = 'Product created successfully!';
        this.isLoading = false;

        // Reset form or redirect
        setTimeout(() => {
          this.router.navigate(['/inventory']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.errorMessage =
          error.message || 'Failed to create product. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
