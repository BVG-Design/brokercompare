# Broker Tools (BrokerCompare)

Broker Tools is a research project and digital platform designed to help the broker industry discover, compare, and understand the best tools and services available. We take a human approach to technology, using AI to assist in research while maintaining transparency and user control.

## 🚀 Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **CMS:** [Sanity.io](https://www.sanity.io/)
-   **Database / Auth:** [Supabase](https://supabase.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/brokercompare.git
    cd brokercompare
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Environment Variables:
    Create a `.env.local` file in the root directory. You will need keys for Sanity and Supabase.
    
    ```bash
    # Sanity CMS
    NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
    NEXT_PUBLIC_SANITY_DATASET=production
    
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal, e.g., 9002) to view the application.

## 📂 Project Structure

-   `src/app`: Main application routes (App Router).
    -   `(main)`: Core marketing and information pages (Home, About, Legal).
    -   `(directory)`: Listings, Search, and Comparison functionality.
    -   `(resources)`: Blog and educational resources.
-   `src/components`: Reusable UI components.
-   `sanity`: Sanity Studio configuration and schemas.
-   `public`: Static assets.

## ✨ Key Features

-   **Directory & Listings**: specific product pages with detailed features.
-   **Comparison Tool**: Side-by-side comparison of broker tools.
-   **Resource Hub**: Blog posts, guides, and industry updates managed via Sanity.
-   **Legal & Trust**: Dedicated Privacy Policy, Terms & Conditions, and AI & Data Use Policy pages focusing on transparency.

## 📜 Legal Pages

This project includes specific legal documentation:
-   **Privacy Policy**: `/privacy`
-   **Terms & Conditions**: `/terms`
-   **AI & Data Use Policy**: `/ai-data-use-policy`

## 🤝 Contributing

This is a research project currently under active development.

## 📄 License

All content and research findings belong to Broker Tools unless otherwise noted.
