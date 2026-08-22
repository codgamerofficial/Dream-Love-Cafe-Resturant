# Supabase PostgreSQL Database Architecture

The schema file is maintained in `supabase/schema.sql`.

## Table Overview

1. `restaurant_settings`: Stores phone, address, operating hours, and instructions.
2. `menu_categories`: Hierarchical category layout.
3. `menu_items`: Items with exact pricing, portion tags, veg indicator, and availability status.
4. `gallery_items`: Photo gallery entries.
5. `reservations`: Table booking requests with statuses (`pending`, `confirmed`, `completed`, `cancelled`).
6. `orders`: Order records generated upon WhatsApp checkout.
7. `order_items`: Line items for order records.
8. `customer_stories`: Manually curated customer reviews.

## Row Level Security (RLS)

* **Public**: Read access for settings, categories, menu items, gallery, and customer stories. Insert access for reservations and order requests.
* **Authenticated Admin**: Full read/write/update/delete access across all tables.
