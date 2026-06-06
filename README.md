# 🍞 The Bread Basket — Home Bakery Catalog

A classy, mobile-ready product catalog for a home bakery business. Customers can browse items and contact you directly via WhatsApp to order.

---

## 📁 Folder Structure

```
bakery-catalog/
├── index.html          ← Main page
├── css/
│   └── style.css       ← All styling
├── js/
│   ├── products.js     ← YOUR PRODUCTS & WhatsApp number (edit this!)
│   └── app.js          ← App logic (no need to edit)
└── images/
    ├── bg-hero.png     ← Hero background (provided)
    ├── bg-pattern.png  ← Pattern background (provided)
    └── ...             ← Add your own product photos here
```

---

## ⚙️ Setup (2 steps)

### 1. Add your WhatsApp number
Open `js/products.js` and change this line:
```js
const WHATSAPP_NUMBER = "27XXXXXXXXX";
```
Use your number in international format — no `+`, no spaces, no leading `0`.
Example for South Africa: `27821234567`

### 2. Add your products & photos

In `js/products.js`, edit the `PRODUCTS` array:
```js
{
    id: 1,
    name: "Banana Loaf",
    price: "R 70.00",
    description: "Your full product description here...",
    images: ["images/banana1.jpg", "images/banana2.jpg"],   // multiple images = gallery slider
    tags: ["Fan Favourite", "Dairy-Free Option"]
}
```

- Put your product photos in the `images/` folder
- Use the filename in the `images` array
- Multiple images get a carousel in the modal
- If an image is missing, it gracefully falls back to the pattern background

---

## 🌐 Deploying to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to **Settings → Pages**
3. Set Source to `main` branch, `/ (root)` folder
4. Your site will be live at `https://yourusername.github.io/your-repo-name`

---

## ✨ Features

- Animated loading screen
- Full-screen hero with background photo
- Product cards that elevate on hover
- Click any card → beautiful modal with image gallery
- WhatsApp "Contact to Order" button with pre-filled message
- Smooth scroll animations throughout
- Fully mobile responsive
- No frameworks needed — pure HTML, CSS & JS
