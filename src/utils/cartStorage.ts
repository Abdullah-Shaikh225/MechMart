import { supabase } from '../lib/supabase';

export interface CartItem {
    id?: number;        // DB row ID
    product_id: string;
    name: string;
    price: number;
    image: string;
    size?: string;
    quantity: number;
}

export const getCart = async (): Promise<CartItem[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching cart:', error.message);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        product_id: row.product_id,
        name: row.name,
        price: Number(row.price),
        image: row.image || '',
        size: row.size || undefined,
        quantity: row.quantity,
    }));
};

export const addToCart = async (item: Omit<CartItem, 'id'>): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if same product + size already in cart
    const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', item.product_id)
        .eq('size', item.size || '')
        .maybeSingle();

    if (existing) {
        await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + item.quantity })
            .eq('id', existing.id);
    } else {
        await supabase.from('cart_items').insert({
            user_id: user.id,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size || '',
            quantity: item.quantity,
        });
    }
};

export const updateCartQuantity = async (rowId: number, quantity: number): Promise<void> => {
    if (quantity <= 0) {
        await supabase.from('cart_items').delete().eq('id', rowId);
    } else {
        await supabase.from('cart_items').update({ quantity }).eq('id', rowId);
    }
};

export const removeFromCart = async (rowId: number): Promise<void> => {
    await supabase.from('cart_items').delete().eq('id', rowId);
};

export const getCartCount = async (): Promise<number> => {
    const items = await getCart();
    return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const clearCart = async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
};
