# Admin Pages Visual Structure

## 1. Room Management Page (/dashboard/rooms)

```
┌─────────────────────────────────────────────────────────────────┐
│  Room Management                                                 │
│  Manage rooms, capacity, and assignments                        │
├─────────────────────────────────────────────────────────────────┤
│  [Search rooms...]  [All Rooms ▾]       [+ Create Room]        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ 🏠 Room 101 │  │ 🏠 Room 102 │  │ 🏠 Room 103 │            │
│  │ [Active]    │  │ [Inactive]  │  │ [Active]    │            │
│  │             │  │             │  │             │            │
│  │ Description │  │ Description │  │ Description │            │
│  │             │  │             │  │             │            │
│  │ Capacity: 4 │  │ Capacity: 2 │  │ Capacity: 6 │            │
│  │ Users: 3    │  │ Users: 0    │  │ Users: 5    │            │
│  │ Products: 8 │  │ Products: 4 │  │ Products: 12│            │
│  │             │  │             │  │             │            │
│  │ Created:    │  │ Created:    │  │ Created:    │            │
│  │ Jan 15, 25  │  │ Jan 10, 25  │  │ Jan 20, 25  │            │
│  │             │  │             │  │             │            │
│  │ [Edit] [Del]│  │ [Edit] [Del]│  │ [Edit] [Del]│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Create/Edit Modal:
┌────────────────────────┐
│ Create New Room        │
├────────────────────────┤
│ Name *                 │
│ [________________]     │
│                        │
│ Description            │
│ [________________]     │
│ [________________]     │
│                        │
│ Capacity *             │
│ [1]                    │
│                        │
│ ☑ Active               │
│                        │
│ [Cancel]    [Create]   │
└────────────────────────┘
```

## 2. Product Management Page (/dashboard/products)

```
┌─────────────────────────────────────────────────────────────────┐
│  Product Management                                              │
│  Manage products, pricing, and inventory                        │
├─────────────────────────────────────────────────────────────────┤
│  [Search products...] [All Products ▾] [All Categories ▾]      │
│                                            [+ Create Product]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   [IMAGE]   │  │   [IMAGE]   │  │     📦      │            │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤            │
│  │ Coffee      │  │ Sandwich    │  │ Water       │            │
│  │ [Beverage]  │  │ [Food]      │  │ [Beverage]  │            │
│  │ [Active]    │  │ [Active]    │  │ [Active]    │            │
│  │             │  │             │  │             │            │
│  │ Description │  │ Description │  │ Description │            │
│  │ text here...│  │ text here...│  │ text here...│            │
│  │             │  │             │  │             │            │
│  │ Price: €2.50│  │ Price: €4.00│  │ Price: €1.00│            │
│  │ In Rooms: 3 │  │ In Rooms: 5 │  │ In Rooms: 8 │            │
│  │             │  │             │  │             │            │
│  │ Created:    │  │ Created:    │  │ Created:    │            │
│  │ Jan 15, 25  │  │ Jan 10, 25  │  │ Jan 20, 25  │            │
│  │             │  │             │  │             │            │
│  │ [Edit] [Del]│  │ [Edit] [Del]│  │ [Edit] [Del]│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Create/Edit Modal:
┌────────────────────────┐
│ Create New Product     │
├────────────────────────┤
│ Name *                 │
│ [________________]     │
│                        │
│ Description            │
│ [________________]     │
│ [________________]     │
│                        │
│ Price (€) *            │
│ [0.00]                 │
│                        │
│ Category               │
│ [________________]     │
│                        │
│ Image URL              │
│ [________________]     │
│ ┌────────────────┐     │
│ │  [Preview]     │     │
│ └────────────────┘     │
│                        │
│ ☑ Active               │
│                        │
│ [Cancel]    [Create]   │
└────────────────────────┘
```

## 3. User Management Page (/dashboard/users)

### Desktop View (Table)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  User Management                                                         │
│  Manage users, roles, and room assignments                              │
├─────────────────────────────────────────────────────────────────────────┤
│  [Search users...]  [All Roles ▾]  [All Rooms ▾]                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ USER            │ ROLE    │ ROOM      │ PURCHASES │ CREATED  │ ACT │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │ John Doe       │ [ADMIN] │ -         │ 0         │ Jan 1,25 │ E D │ │
│  │ john@email.com │         │           │           │          │     │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │ Jane Smith     │ [WORKER]│ Room 101  │ 0         │ Jan 5,25 │ E D │ │
│  │ jane@email.com │         │           │           │          │     │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │ Bob Johnson    │ [CLIENT]│ Room 102  │ 15        │ Jan 10,25│ E D │ │
│  │ bob@email.com  │         │           │           │          │     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile View (Cards)
```
┌─────────────────────────────┐
│  [Search users...]          │
│  [All Roles ▾] [All Rooms ▾]│
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │ John Doe    [ADMIN]   │  │
│  │ john@email.com        │  │
│  │ Room: -               │  │
│  │ Purchases: 0          │  │
│  │ Created: Jan 1, 2025  │  │
│  │ [Edit]      [Delete]  │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ Jane Smith  [WORKER]  │  │
│  │ jane@email.com        │  │
│  │ Room: Room 101        │  │
│  │ Purchases: 0          │  │
│  │ Created: Jan 5, 2025  │  │
│  │ [Edit]      [Delete]  │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

Edit User Modal:
```
┌────────────────────────┐
│ Edit User              │
├────────────────────────┤
│ Email: bob@email.com   │
│ Name: Bob Johnson      │
├────────────────────────┤
│ Role *                 │
│ [CLIENT ▾]             │
│ • Client               │
│ • Worker               │
│ • Admin                │
│                        │
│ Assign Room            │
│ [Room 102 ▾]           │
│ • No Room              │
│ • Room 101             │
│ • Room 102             │
│ • Room 103             │
│                        │
│ [Cancel]    [Update]   │
└────────────────────────┘
```

## Color Coding

### Status Badges
- **Active** - Green background, green text
- **Inactive** - Red background, red text

### Role Badges
- **ADMIN** - Purple background, purple text
- **WORKER** - Blue background, blue text
- **CLIENT** - Green background, green text

### Category Badges (Products)
- Blue background, blue text

## Animation
All cards fade in with GSAP animation (0.6s duration, staggered by 0.1s)

## Dark Mode
All pages support dark mode with appropriate color schemes:
- Background: gray-900
- Cards: gray-800
- Text: white/gray-300
- Borders: gray-700
