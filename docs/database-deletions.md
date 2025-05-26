# Database Deletions Guide

This guide explains how to properly handle database deletions in the Golden HomeShare Marketplace application, especially when dealing with foreign key constraints.

## Overview

Our database uses foreign key constraints to maintain data integrity. When trying to delete records that are referenced by other tables, you may encounter foreign key constraint errors. We've implemented several solutions to handle this properly.

## Cascade Deletes

We've configured cascade deletes in our Prisma schema for the following relationships:

### User Deletions
When a user is deleted, the following records are automatically deleted:
- **HomeownerProfile** and **HousemateProfile** (via `onDelete: Cascade`)
- **ChatRoom** records where the user is homeowner or housemate (via `onDelete: Cascade`)
- **Message** records sent by the user (via `onDelete: Cascade`)
- **Application** records where the user is the housemate (via `onDelete: Cascade`)
- **Product** records owned by the user (via `onDelete: Cascade`)

### Product Deletions
When a product is deleted, the following records are automatically deleted:
- **ChatRoom** records for that product (via `onDelete: Cascade`)
- **Application** records for that product (via `onDelete: Cascade`)

### ChatRoom Deletions
When a chat room is deleted, the following records are automatically deleted:
- **Message** records in that chat room (via `onDelete: Cascade`)

## Safe Deletion Functions

We provide utility functions in `lib/database-utils.ts` for safe deletions:

### `safeDeleteUser(userId: string)`
```typescript
import { safeDeleteUser } from "@/lib/database-utils";

try {
  const result = await safeDeleteUser(userId);
  console.log(result.message); // "User deleted successfully"
} catch (error) {
  console.error("Failed to delete user:", error);
}
```

### `safeDeleteProduct(productId: string, userId?: string)`
```typescript
import { safeDeleteProduct } from "@/lib/database-utils";

try {
  const result = await safeDeleteProduct(productId, userId);
  console.log(result.message); // "Product deleted successfully"
} catch (error) {
  console.error("Failed to delete product:", error);
}
```

### `safeDeleteChatRoom(chatRoomId: string, userId?: string)`
```typescript
import { safeDeleteChatRoom } from "@/lib/database-utils";

try {
  const result = await safeDeleteChatRoom(chatRoomId, userId);
  console.log(result.message); // "Chat room deleted successfully"
} catch (error) {
  console.error("Failed to delete chat room:", error);
}
```

## API Endpoints

We provide API endpoints for deletions:

### Delete User
```
DELETE /api/user/delete?userId={userId}
```

### Delete Product
```
DELETE /api/product/delete?productId={productId}
```

### Delete Chat Room
```
DELETE /api/chat/delete?chatRoomId={chatRoomId}
```

### Admin Cleanup
```
POST /api/admin/cleanup
```
Cleans up orphaned chat rooms (requires admin access).

## Best Practices

1. **Always use transactions** when performing multiple related deletions
2. **Use the safe deletion functions** instead of direct Prisma deletions
3. **Verify ownership** before allowing deletions (especially for products and chat rooms)
4. **Handle errors gracefully** and provide meaningful error messages to users
5. **Log deletion operations** for audit purposes

## Troubleshooting

### "Unable to delete row as it is currently referenced by a foreign key constraint"

This error occurs when trying to delete a record that is still referenced by other tables. Solutions:

1. **Use the safe deletion functions** provided in `lib/database-utils.ts`
2. **Check if cascade deletes are properly configured** in the Prisma schema
3. **Run the cleanup function** to remove orphaned records: `POST /api/admin/cleanup`

### Testing Deletions

Run the test script to verify deletion functions work correctly:

```bash
npx ts-node scripts/test-deletions.ts
```

## Schema Updates

If you need to add new cascade deletes, update the Prisma schema and run a migration:

```prisma
model Example {
  // Add onDelete: Cascade to foreign key relationships
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Then run:
```bash
npx prisma migrate dev --name add-cascade-deletes
```

## Migration History

- `20250526221232_add_cascade_deletes`: Added cascade deletes for ChatRoom relationships
- `20250526222845_add_message_cascade_deletes`: Added cascade deletes for Message and Product relationships 