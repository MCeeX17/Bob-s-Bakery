// ════════════════════════════════════════════════════════════
//  CONFIGURATION — edit these two things:
// ════════════════════════════════════════════════════════════

// Your WhatsApp number in international format (no +, no spaces)
const WHATSAPP_NUMBER = "27681932383";

// ── Add / remove products here ────────────────────────────────
const PRODUCTS = [
    {
        id: 1,
        name: "Coffee Muffins",
        price: "R 70.00",
        description: "Six cloud-soft muffins infused with rich coffee flavour — the perfect morning pick-me-up. Baked fresh to order with a golden top and tender crumb.",
        images: ["images/muffins1.jpg"],
        tags: ["Half Dozen", "Made to Order"]
    },
    {
        id: 2,
        name: "Chocolate Muffins",
        price: "R 60.00",
        description: "A half-dozen batch of fluffy, cloud-soft muffins loaded with premium dark chocolate chips. Baked fresh to order — crispy tops, pillowy centres, zero regrets.",
        images: ["images/muffins1.jpg"],
        tags: ["Half Dozen", "Made to Order"]
    },
    {
        id: 3,
        name: "Banana Loaf",
        price: "R 70.00",
        description: "Moist, golden-crusted banana loaf made from the ripest bananas and a hint of vanilla. Perfectly dense, perfectly sweet — a timeless home-bake that pairs beautifully with butter and a cup of rooibos.",
        images: ["images/banana1.jpg", "images/banana2.jpg"],
        tags: ["Fan Favourite", "Dairy-Free Option"]
    },
    {
        id: 4,
        name: "Ginger Pot",
        price: "R 90.00",
        description: "A warming ginger-spiced treat baked in individual pots — bold, fragrant, and utterly comforting. A beloved South African classic made with love.",
        images: ["images/bg-pattern.png"],
        tags: ["Spiced", "SA Classic"]
    },
    {
        id: 5,
        name: "Chocolate Brownies",
        price: "R 100.00",
        description: "Deeply fudgy, rich chocolate brownies with a crinkly top and an intensely chocolatey centre. Made with real dark chocolate — not cocoa powder. Impossible to resist.",
        images: ["images/bg-pattern.png"],
        tags: ["Fudgy", "Crowd Pleaser"]
    },
    {
        id: 6,
        name: "Malva Pudding",
        price: "R 120.00",
        description: "The ultimate South African comfort dessert. Sticky, apricot-sweet sponge soaked in a warm cream sauce. Best served hot — a guaranteed crowd-stopper.",
        images: ["images/bg-pattern.png"],
        tags: ["SA Classic", "Best Warm"]
    },
    {
        id: 7,
        name: "Peppermint Crisp Tart",
        price: "R 150.00",
        description: "Layers of velvety caramel cream, crumbled peppermint crisp chocolate, and classic Tennis biscuit — chilled to perfection. South Africa's most beloved no-bake dessert.",
        images: ["images/bg-pattern.png"],
        tags: ["No-Bake", "SA Favourite"]
    }
];
