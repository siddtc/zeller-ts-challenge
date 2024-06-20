// Define the Product interface
interface Product {
  name: string;
  price: number;
}

// Define the product catalogue as an object
const products: { [sku: string]: Product } = {
  ipd: { name: 'Super iPad', price: 549.99 },
  mbp: { name: 'MacBook Pro', price: 1399.99 },
  atv: { name: 'Apple TV', price: 109.50 },
  vga: { name: 'VGA adapter', price: 30.00 }
};

// Define the PricingRule interface
interface PricingRule {
  apply: (items: string[]) => number;
}

