# MultiMey Supplies

MultiMey Supplies is a modern, high-performance e-commerce platform built with Next.js, Supabase, and Tailwind CSS. It is designed to provide a seamless shopping experience for customers looking for quality products like perfume, electronics, fashion, and more from Accra, Ghana.

## Features

### 🛍️ Client Features
*   **Modern Storefront:** fast, responsive, and mobile-first design using Tailwind CSS.
*   **Shopping Cart & Wishlist:** Fully functional cart and wishlist with persistent local storage.
*   **Categories & Search:** Easy product discovery through categories and real-time search.
*   **Product Details:** Rich product pages with image galleries, variants, and related items.
*   **PWA Support:** Installable as a Progressive Web App (PWA) for a native-like experience.

### 🛠️ Admin Features
*   **Dashboard:** Real-time analytics and sales overview.
*   **Product Management:** Full CRUD operations for products, categories, and inventory.
*   **Order Management:** Track and process orders from placement to delivery.
*   **Site Configuration:** Manage site settings (Logo, Name, Social Links) directly from the admin panel.
*   **Homepage Builder:** Dynamically update homepage banners and featured sections.
*   **CMS Integration:** Content updates reflect instantly without redeploying.

## Tech Stack

*   **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
*   **Database & Auth:** [Supabase](https://supabase.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** React Context API (Cart, Wishlist, CMS)
*   **Icons:** [Remix Icon](https://remixicon.com/)
*   **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

*   Node.js 18+ installed
*   A Supabase project created

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sasusavage/barnsPerfume.git
    cd barnsPerfume
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## Deployment

This project is optimized for deployment on Vercel.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the environment variables from `.env.local`.
4.  Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## License

This project is licensed under the MIT License.
