export interface CartItem {
  id: string;
  name: string;
  variationName?: string;
  price: number;
  quantity: number;
  image?: string;
  modifiers?: CartItemModifier[];
}

export interface CartItemModifier {
  id: string;
  name: string;
  price: number;
}
