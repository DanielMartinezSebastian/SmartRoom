-- SmartRoom Database Schema
-- Execute this SQL in Supabase SQL Editor

-- Create ENUM types
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'WORKER', 'CLIENT');
CREATE TYPE "ProductStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK');
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- Create Room table
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- Create Product table
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "supabaseId" TEXT NOT NULL,
    "roomId" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create RoomProduct junction table
CREATE TABLE "RoomProduct" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'AVAILABLE',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomProduct_pkey" PRIMARY KEY ("id")
);

-- Create Purchase table
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");
CREATE UNIQUE INDEX "RoomProduct_roomId_productId_key" ON "RoomProduct"("roomId", "productId");

-- Create indexes for better performance
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_supabaseId_idx" ON "User"("supabaseId");
CREATE INDEX "User_roomId_idx" ON "User"("roomId");
CREATE INDEX "Room_isActive_idx" ON "Room"("isActive");
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");
CREATE INDEX "RoomProduct_roomId_idx" ON "RoomProduct"("roomId");
CREATE INDEX "RoomProduct_productId_idx" ON "RoomProduct"("productId");
CREATE INDEX "RoomProduct_status_idx" ON "RoomProduct"("status");
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");
CREATE INDEX "Purchase_productId_idx" ON "Purchase"("productId");
CREATE INDEX "Purchase_status_idx" ON "Purchase"("status");
CREATE INDEX "Purchase_createdAt_idx" ON "Purchase"("createdAt");

-- Add foreign key constraints
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RoomProduct" ADD CONSTRAINT "RoomProduct_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoomProduct" ADD CONSTRAINT "RoomProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enable Row Level Security (RLS)
ALTER TABLE "Room" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RoomProduct" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Purchase" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Room policies
CREATE POLICY "Room select policy" ON "Room" FOR SELECT USING (true);
CREATE POLICY "Room insert policy" ON "Room" FOR INSERT WITH CHECK (true);
CREATE POLICY "Room update policy" ON "Room" FOR UPDATE USING (true);
CREATE POLICY "Room delete policy" ON "Room" FOR DELETE USING (true);

-- Product policies
CREATE POLICY "Product select policy" ON "Product" FOR SELECT USING (true);
CREATE POLICY "Product insert policy" ON "Product" FOR INSERT WITH CHECK (true);
CREATE POLICY "Product update policy" ON "Product" FOR UPDATE USING (true);
CREATE POLICY "Product delete policy" ON "Product" FOR DELETE USING (true);

-- User policies
CREATE POLICY "User select policy" ON "User" FOR SELECT USING (true);
CREATE POLICY "User insert policy" ON "User" FOR INSERT WITH CHECK (true);
CREATE POLICY "User update policy" ON "User" FOR UPDATE USING (true);
CREATE POLICY "User delete policy" ON "User" FOR DELETE USING (true);

-- RoomProduct policies
CREATE POLICY "RoomProduct select policy" ON "RoomProduct" FOR SELECT USING (true);
CREATE POLICY "RoomProduct insert policy" ON "RoomProduct" FOR INSERT WITH CHECK (true);
CREATE POLICY "RoomProduct update policy" ON "RoomProduct" FOR UPDATE USING (true);
CREATE POLICY "RoomProduct delete policy" ON "RoomProduct" FOR DELETE USING (true);

-- Purchase policies
CREATE POLICY "Purchase select policy" ON "Purchase" FOR SELECT USING (true);
CREATE POLICY "Purchase insert policy" ON "Purchase" FOR INSERT WITH CHECK (true);
CREATE POLICY "Purchase update policy" ON "Purchase" FOR UPDATE USING (true);
CREATE POLICY "Purchase delete policy" ON "Purchase" FOR DELETE USING (true);
