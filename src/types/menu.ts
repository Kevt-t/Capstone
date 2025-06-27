export interface PriceMoney {
  amount: number;
  currency: string;
}

export interface Variation {
  id: string;
  name: string;
  price_money: PriceMoney;
  item_variation_data?: {
    item_id?: string;
    name?: string;
    price_money?: PriceMoney;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  category_id?: string;
  category_name?: string;
  variations: Variation[];
}

export interface MenuCategory {
  id: string;
  name: string;
}

export interface MenuData {
  items: MenuItem[];
  categories: MenuCategory[];
}
