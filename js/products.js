// ════════════════════════════════════════════════════════════
//  CONFIGURATION — edit these two things:
// ════════════════════════════════════════════════════════════

// Your WhatsApp number in international format (no +, no spaces)
const WHATSAPP_NUMBER = "27XXXXXXXXX";

// ── Add / remove products here ────────────────────────────────
// images[] → paths relative to the images/ folder
// tags[]   → short labels shown on the card & modal
const PRODUCTS = [
    {
        id: 1,
        name: "Banana Loaf",
        price: "R 70.00",
        description: "Moist, golden-crusted banana loaf made from the ripest bananas and a hint of vanilla. Perfectly dense, perfectly sweet — a timeless home-bake that pairs beautifully with butter and a cup of rooibos.",
        images: [
            "images/banana1.jpg",
            "images/banana2.jpg"
        ],
        tags: ["Fan Favourite", "Dairy-Free Option"]
    },
    {
        id: 2,
        name: "Choc-Chip Muffins",
        price: "R 60.00",
        description: "A half-dozen batch of fluffy, cloud-soft muffins loaded with premium dark chocolate chips. Baked fresh to order — crispy tops, pillowy centres, zero regrets.",
        images: [
            "images/muffins1.jpg"
        ],
        tags: ["Half Dozen", "Made to Order"]
    },
    {
        id: 3,
        name: "Artisan Sourdough",
        price: "R 90.00",
        description: "A slow-fermented sourdough with a crackling crust and an open, chewy crumb. Our 48-hour cold-proof produces complex flavour you won't find on any shelf.",
        images: [
            "images/sourdough1.jpg"
        ],
        tags: ["48hr Ferment", "Vegan"]
    },
    {
        id: 4,
        name: "Cinnamon Rolls",
        price: "R 80.00",
        description: "Six pillowy rolls swirled with cinnamon sugar and finished with a drizzle of cream cheese glaze. Best enjoyed warm. Impossible to eat just one.",
        images: [
            "images/cinnamon1.jpg"
        ],
        tags: ["Pack of 6", "Seasonal Favourite"]
    }
];
