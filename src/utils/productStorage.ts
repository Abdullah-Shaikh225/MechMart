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
        stock: Number(row.stock) || 0,
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
        stock: product.stock,
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

export const updateProductStock = async (id: string, stock: number): Promise<void> => {
    const { error } = await supabase
        .from('products')
        .update({ stock })
        .eq('id', id);

    if (error) {
        console.error('Error updating stock:', error.message);
        throw new Error(error.message);
    }
};

export const decrementStock = async (productId: string, quantity: number): Promise<void> => {
    const { error } = await supabase.rpc('decrement_stock', {
        p_product_id: productId,
        p_quantity: quantity,
    });

    if (error) {
        console.error('Error decrementing stock:', error.message);
        throw new Error(error.message);
    }
};
