// Define the product catalogue as an object
var products = {
    ipd: { name: "Super iPad", price: 549.99 },
    mbp: { name: "MacBook Pro", price: 1399.99 },
    atv: { name: "Apple TV", price: 109.5 },
    vga: { name: "VGA adapter", price: 30.0 },
};
// Define the pricing rules
// Decoupling the pricing rule as it can be anything in the future...
var pricingRules = [
    {
        apply: function (items) {
            // 3 for 2 deal on Apple TVs
            var atvCount = items.filter(function (sku) { return sku === "atv"; }).length;
            var atvPrice = products["atv"].price;
            var freeAtvs = Math.floor(atvCount / 3);
            var atvTotal = (atvCount - freeAtvs) * atvPrice;
            return atvTotal;
        },
    },
    {
        apply: function (items) {
            // Bulk discount for Super iPads
            var ipdCount = items.filter(function (sku) { return sku === "ipd"; }).length;
            var ipdPrice = ipdCount > 4 ? 499.99 : products["ipd"].price;
            var ipdTotal = ipdCount * ipdPrice;
            return ipdTotal;
        },
    },
];
var Checkout = /** @class */ (function () {
    function Checkout(pricingRules) {
        this.items = [];
        this.pricingRules = pricingRules;
    }
    Checkout.prototype.scan = function (sku) {
        if (products[sku]) {
            this.items.push(sku);
        }
        else {
            console.error("Product with SKU: ".concat(sku, " not found"));
        }
    };
    Checkout.prototype.total = function () {
        var totalPrice = 0;
        // Apply pricing rules
        for (var _i = 0, _a = this.pricingRules; _i < _a.length; _i++) {
            var rule = _a[_i];
            totalPrice += rule.apply(this.items);
        }
        // Calculate total for items not affected by pricing rules
        var skusWithDiscounts = ["atv", "ipd"];
        var remainingItems = this.items.filter(function (sku) { return !skusWithDiscounts.includes(sku); });
        for (var _b = 0, remainingItems_1 = remainingItems; _b < remainingItems_1.length; _b++) {
            var sku = remainingItems_1[_b];
            totalPrice += products[sku].price;
        }
        return totalPrice;
    };
    return Checkout;
}());
// Testing the checkout system
var co = new Checkout(pricingRules);
co.scan("atv");
co.scan("atv");
co.scan("atv");
co.scan("vga");
console.log("Total expected: $", co.total()); // Output: Total expected: 249.00
var co2 = new Checkout(pricingRules);
co2.scan("atv");
co2.scan("ipd");
co2.scan("ipd");
co2.scan("atv");
co2.scan("ipd");
co2.scan("ipd");
co2.scan("ipd");
console.log("Total expected: $", co2.total()); // Output: Total expected: 2718.95
