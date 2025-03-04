// types.ts

export interface Product {
    id: string;
    title: string;
    price: number;
    currency_id: string;
    thumbnail: string;
    shipping: {
      free_shipping: boolean;
    };
    seller: {
      id: number;
    };
  }
  