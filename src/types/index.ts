export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    rating: number;
    reviews: number;
    imageUrl: string;
    images?: string[]; // Additional images for gallery
    description?: string;
    sizes?: string[];
    category: string;
    isNewArrival?: boolean;
}
