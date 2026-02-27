import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';

export const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error.message);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        price: Number(row.price),
        discountPercentage: Number(row.discount_percentage) || 0,
        rating: Number(row.rating) || 0,
        image: row.image || '',
    }));
};

export const saveProduct = async (product: Product): Promise<void> => {
    const { error } = await supabase.from('products').insert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount_percentage: product.discountPercentage,
        rating: product.rating,
        image: product.image,
    });

    if (error) {
        console.error('Error saving product:', error.message);
        throw new Error(error.message);
    }
};

export const deleteProduct = async (id: string): Promise<void> => {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        console.error('Error deleting product:', error.message);
        throw new Error(error.message);
    }
};
