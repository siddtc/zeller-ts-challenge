// Define the Product interface
interface Product {
  name: string;
  price: number;
}

// Define the product catalogue as an object
const products: { [sku: string]: Product } = {
  ipd: { name: "Super iPad", price: 549.99 },
  mbp: { name: "MacBook Pro", price: 1399.99 },
  atv: { name: "Apple TV", price: 109.5 },
  vga: { name: "VGA adapter", price: 30.0 },
};

// Define the PricingRule interface
interface PricingRule {
  apply: (items: string[]) => number;
}

// Define the pricing rules
// Decoupling the pricing rule as it can be anything in the future...
const pricingRules: PricingRule[] = [
  {
    apply: (items: string[]) => {
      // 3 for 2 deal on Apple TVs
      const atvCount = items.filter((sku) => sku === "atv").length;
      const atvPrice = products["atv"].price;
      const freeAtvs = Math.floor(atvCount / 3);
      const atvTotal = (atvCount - freeAtvs) * atvPrice;
      return atvTotal;
    },
  },
  {
    apply: (items: string[]) => {
      // Bulk discount for Super iPads
      const ipdCount = items.filter((sku) => sku === "ipd").length;
      const ipdPrice = ipdCount > 4 ? 499.99 : products["ipd"].price;
      const ipdTotal = ipdCount * ipdPrice;
      return ipdTotal;
    },
  },
];

class Checkout {
  private items: string[] = [];
  private pricingRules: PricingRule[];

  constructor(pricingRules: PricingRule[]) {
    this.pricingRules = pricingRules;
  }

  scan(sku: string): void {
    if (products[sku]) {
      this.items.push(sku);
    } else {
      console.error(`Product with SKU: ${sku} not found`);
    }
  }

  total(): number {
    let totalPrice = 0;

    // Apply pricing rules
    for (const rule of this.pricingRules) {
      totalPrice += rule.apply(this.items);
    }

    // Calculate total for items not affected by pricing rules
    const skusWithDiscounts = ["atv", "ipd"];
    const remainingItems = this.items.filter(
      (sku) => !skusWithDiscounts.includes(sku)
    );
    for (const sku of remainingItems) {
      totalPrice += products[sku].price;
    }

    return totalPrice;
  }
}

// Testing the checkout system
const co = new Checkout(pricingRules);

co.scan("atv");
co.scan("atv");
co.scan("atv");
co.scan("vga");

console.log("Total expected: $", co.total()); // Output: Total expected: 249.00

const co2 = new Checkout(pricingRules);

co2.scan("atv");
co2.scan("ipd");
co2.scan("ipd");
co2.scan("atv");
co2.scan("ipd");
co2.scan("ipd");
co2.scan("ipd");

console.log("Total expected: $", co2.total()); // Output: Total expected: 2718.95
