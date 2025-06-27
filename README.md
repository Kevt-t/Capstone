# Restaurant Ordering Website with Square Integration

A Next.js-based restaurant ordering platform with Square API integration for menu management, payments, and order processing.

## 📖 Overview

This application provides a complete online ordering solution for restaurants, allowing customers to browse the menu (pulled from Square Catalog), add items to cart, and complete checkout with Square Payments. The platform is designed for pickup orders and integrates directly with Square's ecosystem.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript and React
- **Styling**: TailwindCSS
- **State Management**: React Context API and Zustand
- **Payment Processing**: Square Web Payments SDK
- **API Integration**: Square Node.js SDK

## 🔑 Key Features

- **Menu Display**: Dynamically loads and displays menu items from Square Catalog
- **Cart Management**: Add, remove, and update quantities for items in cart
- **Checkout Flow**: Integrated with Square's payment processing
- **Order Management**: Creates orders in Square's system for staff to fulfill
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Square Developer Account
- Square Application with API access
- Square Location for testing

### Environment Setup

1. Clone the repository
2. Copy `.env.local` and update with your Square credentials:

```
# Square API Settings
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
SQUARE_APPLICATION_ID=your_square_application_id
SQUARE_ENVIRONMENT=sandbox  # or production

# Next.js Settings
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_application_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox  # or production
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 🏗️ Project Structure

```
OrderingSite/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes for Square integration
│   │   ├── cart/               # Cart page
│   │   ├── checkout/           # Checkout flow
│   │   ├── menu/               # Menu display
│   │   ├── order-confirmation/ # Order confirmation page
│   ├── components/             # React components
│   │   ├── cart/               # Cart-related components
│   │   ├── checkout/           # Checkout components
│   │   ├── layout/             # Layout components (header, footer)
│   │   ├── menu/               # Menu display components
│   ├── context/                # React context providers
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and API clients
│   │   ├── square/             # Square API integration
│   ├── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── .env.local                  # Environment variables
```

## 🔄 Square Integration

### Catalog Integration

The menu is fetched from Square Catalog API and cached with Next.js ISR for performance.

### Order Creation

When a user checks out, an order is created in Square's system with:
- Line items from the cart
- Customer information
- Pickup details

### Payment Processing

Payments are processed securely using Square's Web Payments SDK.

## 🛣️ Deployment

The application can be deployed to Vercel or any Next.js-compatible hosting service.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Considerations

- All payment processing happens through Square's secure infrastructure
- API keys and tokens are kept server-side only
- HTTPS is enforced for all connections

## 📝 Customization

- Update branding in `tailwind.config.js`
- Modify restaurant information in layout components
- Adjust menu display and filtering options in Menu components

## ⚠️ Important Notes

- For production, ensure you switch to the production Square environment
- Set up proper error tracking and monitoring
- Configure webhook endpoints for real-time catalog and order updates
