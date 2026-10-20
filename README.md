[README.md](https://github.com/user-attachments/files/33740452/README.md)
# DaFoExpress

**A food delivery app in development, built with Conakry, Guinea, in mind.**

DaFoExpress is a personal project I am building to explore how a mobile app can connect customers, restaurants, and delivery drivers. The goal is to bring browsing, ordering, and delivery into one experience while keeping the interface simple and easy to navigate.

The app is built with **React Native, Expo, TypeScript, and Supabase**. It includes customer-facing screens, a starter backend, and a driver-side prototype.

> **Project status: Work in progress.** I am actively developing DaFoExpress, refining the interface, connecting features to the backend, and improving the project structure. Some flows use sample data or simulated behavior. This repository represents an evolving prototype, not a launched delivery service.

## Contents

- [Why I am building this](#why-i-am-building-this)
- [Current features](#current-features)
- [What is still in progress](#what-is-still-in-progress)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Exploring the app](#exploring-the-app)
- [Development notes](#development-notes)
- [Roadmap](#roadmap)
- [Author](#author)

## Why I am building this

I like turning ideas into things people can use. DaFoExpress gives me a way to apply that interest to a place connected to my own experience: Conakry.

Through this project, I am learning how the different parts of an application fit together: the interface a customer sees, authentication, a restaurant catalog, order storage, and the workflow a driver follows. I am also exploring how to design an app around a local setting instead of treating location as an afterthought.

The current interface uses warm brown, orange, and cream tones, with customer and driver experiences that I am continuing to develop.

## Current features

The following features have code or screens in the repository. Their presence does not mean every flow has been fully tested across devices or completed for production use.

### Customer experience

| Feature | Current implementation |
| --- | --- |
| Account access | Phone and email OTP sign-in flows using Supabase Auth. Sending and verifying codes requires a configured Supabase project and the relevant authentication services. |
| Personalized profile | Collects a customer name and includes profile storage logic. |
| Restaurant browsing | Home screen with categories and restaurant listings, with sample catalog data available as a fallback. |
| Restaurant menus | A restaurant detail route for browsing menu items. |
| Basket | A basket screen and cart-to-checkout flow. |
| Checkout | Delivery or pickup selection, delivery address entry, and payment-method selection. |
| Order creation | Supabase-backed functions for creating orders and their associated items. |
| Confirmation | An order confirmation screen and generated delivery-code logic. |
| Order history | An orders screen and a helper for retrieving the signed-in customer's orders. |
| Tracking preview | A map centered on Conakry, sample markers, and simulated progress messages. |

### Driver experience

The driver prototype includes:

- An online/offline availability control.
- A sample delivery request and an active-delivery screen.
- A pickup-to-delivery interaction.
- A customer delivery-code check before marking the local delivery flow complete.

These screens are an initial demonstration of the intended driver experience. Live dispatch, persistent driver status updates, and customer-driver synchronization are still development work.

### Starter backend

The Supabase schema defines tables for:

- Customer profiles.
- Categories, restaurants, and menu items.
- Orders and order items.

It also includes starter row-level security policies and sample catalog inserts. The schema and policies will need further review and testing as the app develops.

## What is still in progress

### Payment processing

Checkout currently offers **Orange Money, card, and cash-on-delivery options**. These are interface selections; selecting a method does not mean a payment has been processed. A production payment-provider integration has not been completed.

Use test information while exploring the prototype. There is no completed live card-payment flow.

### Tracking and driver synchronization

The tracking screen uses fixed map coordinates and timed status changes. It does not currently show a driver's live GPS location. Parts of the driver flow also use local state and demonstration values rather than a fully synchronized backend workflow.

### State management and persistence

Some application state is stored through React state and global variables. I am working toward a more consistent approach to basket persistence, sessions, order state, and coordination between screens.

### Catalog and currency consistency

The app includes sample restaurants and menu items for development. They should not be interpreted as confirmed restaurant partnerships or a live catalog.

The SQL seed data uses Guinea-focused prices, while some fallback data and formatting still use dollar-style values. Currency, fees, and catalog data need to be made consistent before a public release.

### Repository organization

The repository is being organized as files are moved into their intended folders. The canonical navigation screens are under `app/`; some earlier copies may still exist at the repository root.

At the time of this README's preparation, the repository also needed its root `tsconfig.json` and a sanitized `.env.example` restored. The setup below explains the required configuration. The project is not yet a verified, one-command installation on every platform.

## Tech stack

| Technology | How it is used |
| --- | --- |
| React Native | Mobile interface and reusable UI components. |
| Expo | Development tooling, app configuration, and platform launch commands. |
| Expo Router | File-based navigation, tab layouts, and customer/driver routes. |
| TypeScript | Typed screens, models, and shared application logic. |
| Supabase | Authentication, PostgreSQL-backed application data, and database access. |
| Expo SecureStore | Session-storage adapter in the current Supabase client. |
| React Native Maps | Map-based tracking interface. |
| Ionicons | Icons throughout the customer and driver screens. |

The current package configuration uses Expo SDK 54 and React Native 0.81.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/_layout.tsx` | Root navigation layout. |
| `app/(tabs)/` | Customer home, orders, and profile screens with a tab layout. |
| `app/login.tsx` | Phone/email OTP sign-in interface. |
| `app/restaurant/[id].tsx` | Restaurant detail and menu route. |
| `app/basket.tsx` | Basket interface. |
| `app/checkout.tsx` | Address, order type, and payment-method selection. |
| `app/confirmation.tsx` | Order confirmation interface. |
| `app/tracking.tsx` | Map and simulated tracking interface. |
| `app/driver/` | Driver availability and delivery screens. |
| `lib/supabase.ts` | Supabase client and session-storage configuration. |
| `lib/orders.ts` | Order creation and retrieval helpers. |
| `lib/types.ts` | Shared cart, order, and payment types. |
| `lib/mockData.ts` | Fallback restaurant, category, and menu data. |
| `assets/` | Logo, images, and fonts. |
| `components/` | Shared interface components and starter utilities. |
| `constants/` | Shared constants. |
| `supabase/schema.sql` | Development database schema, policies, and sample records. |
| `supabase/email-otp-template.html` | Email OTP template for the authentication setup. |

Keep these folders intact when cloning or uploading the project. Flattening them into the repository root breaks routing, imports, and asset references.

## Getting started

### 1. Prerequisites

You will need:

- Git.
- Node.js and npm compatible with the project's Expo SDK.
- A Supabase development project for authentication and database-backed features.
- An Android device/emulator or iOS device/simulator supported by your Expo development setup.

The app is mobile-focused. A web launch command is included, but native maps and the current SecureStore adapter may require additional platform-specific work for a complete browser experience.

### 2. Clone the repository

```bash
git clone https://github.com/MarieAngeVersini/DaFo-Express.git
cd DaFo-Express
```

### 3. Check the TypeScript configuration

Ensure `tsconfig.json` exists at the project root. The code imports shared modules using the `@/` alias, which should resolve to the project root.

If the file is missing from your checkout, restore it with this configuration:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

### 4. Install dependencies

```bash
npm install
```

### 5. Configure the local environment

Create a `.env` file in the project root. If a sanitized `.env.example` is available, copy it and fill in your own development-project values.

The current Supabase client expects:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

These names must match those used in `lib/supabase.ts`. Use the client-side publishable key for your own Supabase project; do not place a service-role key in the mobile app.

Keep private credentials out of the repository. A shared `.env.example` should contain placeholders only.

### 6. Set up the development database

In a new Supabase development project:

1. Open the SQL Editor.
2. Review `supabase/schema.sql`.
3. Run the script to create the starter tables, policies, and sample catalog.
4. Enable and configure the authentication methods you intend to test.
5. Use `supabase/email-otp-template.html` when configuring the email-code experience.

Phone OTP delivery also requires the appropriate SMS-provider configuration. Sample catalog data does not remove the need for a working backend when testing sign-in or placing orders.

### 7. Start the app

```bash
npm start
```

Available package scripts:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Start Expo with Android as the target. |
| `npm run ios` | Start Expo with iOS as the target; local iOS simulator use requires macOS. |
| `npm run web` | Attempt a web preview; platform-specific compatibility work may still be needed. |

Follow the Expo terminal instructions for your device or emulator. Restart the development server after changing environment variables.

## Exploring the app

A customer walkthrough is intended to follow this flow:

1. Enter a name and sign in with a configured OTP method.
2. Browse the restaurant catalog.
3. Open a restaurant and explore its menu.
4. Add items to the basket.
5. Choose delivery or pickup and continue to checkout.
6. Select a payment method and place a development order.
7. View the confirmation, delivery code, and order history.
8. Explore the tracking preview, remembering that its driver location and progress are simulated.

The driver routes can be explored separately to review the availability control, sample request, and delivery-code interaction. They are not yet evidence of a complete live dispatch service.

## Development notes

- **Catalog not loading:** check the Supabase URL, publishable key, schema, and table access policies. Some catalog screens include fallback records, so seeing restaurants alone does not verify the backend connection.
- **OTP not arriving:** verify the chosen authentication method, provider settings, and email/SMS delivery configuration.
- **Imports not resolving:** check that `lib/`, `assets/`, and the `@/` TypeScript alias have been preserved.
- **Screens not appearing:** confirm the files remain under the correct `app/` folders and that the tab layout is present.
- **Web preview issues:** check native-only dependencies and storage behavior; mobile and browser support are still being refined.
- **Testing:** this README documents the inspected source. It does not claim that the full app has passed end-to-end, payment, or cross-platform testing.

## Roadmap

- [ ] Finish repository cleanup and provide a consistent fresh-clone setup.
- [ ] Improve session handling, route access, and persistent basket state.
- [ ] Validate customer order creation and history end to end.
- [ ] Connect driver assignment and order-stage updates to the backend.
- [ ] Replace simulated tracking with a permission-aware live-location flow.
- [ ] Integrate and test an appropriate payment provider.
- [ ] Standardize prices, delivery fees, and Guinea-focused currency formatting.
- [ ] Improve loading states, error messages, accessibility, and device layouts.
- [ ] Add broader automated tests and documented manual test scenarios.
- [ ] Add screenshots and a recorded demo as the core flows stabilize.

These are development goals, not guarantees that the features are already available.

## Author

**Marie Ange Versini**

Computer Science student at the University of Massachusetts Amherst.

[View the DaFoExpress repository](https://github.com/MarieAngeVersini/DaFo-Express)

---

DaFoExpress is an ongoing learning and development project. I will continue updating the code and this README as the app grows.
