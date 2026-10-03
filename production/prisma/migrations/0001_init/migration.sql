-- CreateEnum
CREATE TYPE "OrderChannel" AS ENUM ('SITE', 'WHATSAPP', 'TALABAT', 'ELMENUS', 'WALKIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'PREP', 'READY', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('NEW', 'QUALIFIED', 'CALL_BOOKED', 'DECK_SENT', 'DISCOVERY', 'PAUSED');

-- CreateEnum
CREATE TYPE "PackBatch" AS ENUM ('A', 'B', 'C');

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "cityAr" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressAr" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "phone" TEXT NOT NULL,
    "mapsUrl" TEXT NOT NULL,
    "live" BOOLEAN NOT NULL DEFAULT false,
    "hours" JSONB NOT NULL,
    "delivery" JSONB NOT NULL,
    "partners" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameRu" TEXT,
    "descEn" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "priceEgp" INTEGER NOT NULL,
    "sizeDelta" JSONB NOT NULL,
    "allergens" TEXT[],
    "tags" TEXT[],
    "kcal" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "onSale" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "storeId" TEXT,
    "channel" "OrderChannel" NOT NULL DEFAULT 'SITE',
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "items" JSONB NOT NULL,
    "subtotalEgp" INTEGER NOT NULL,
    "deliveryEgp" INTEGER NOT NULL DEFAULT 0,
    "discountEgp" INTEGER NOT NULL DEFAULT 0,
    "totalEgp" INTEGER NOT NULL,
    "payMethod" TEXT NOT NULL,
    "payRef" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "promo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "sku" TEXT NOT NULL,
    "batch" "PackBatch" NOT NULL DEFAULT 'A',
    "stars" INTEGER,
    "deviceId" TEXT,
    "referrer" TEXT,
    "repeat" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMember" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "tier" TEXT NOT NULL DEFAULT 'starter',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClubMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointLedger" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "orderId" INTEGER,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "friendPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FranchiseLead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "message" TEXT,
    "stage" "LeadStage" NOT NULL DEFAULT 'NEW',
    "source" TEXT NOT NULL DEFAULT 'site-form',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FranchiseLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeckDownload" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "leadEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeckDownload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'kitchen',
    "storeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreInvite" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoreInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outbox" (
    "id" SERIAL NOT NULL,
    "storeId" TEXT,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentLog" (
    "id" TEXT NOT NULL,
    "anonId" TEXT NOT NULL,
    "necessary" BOOLEAN NOT NULL DEFAULT true,
    "marketing" BOOLEAN NOT NULL DEFAULT false,
    "analytics" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_slug_key" ON "Store"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Order_publicId_key" ON "Order"("publicId");

-- CreateIndex
CREATE INDEX "Order_storeId_createdAt_idx" ON "Order"("storeId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Scan_storeId_createdAt_idx" ON "Scan"("storeId", "createdAt");

-- CreateIndex
CREATE INDEX "Scan_sku_idx" ON "Scan"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMember_publicId_key" ON "ClubMember"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMember_phone_key" ON "ClubMember"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "FranchiseLead_email_key" ON "FranchiseLead"("email");

-- CreateIndex
CREATE INDEX "FranchiseLead_stage_idx" ON "FranchiseLead"("stage");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StoreInvite_code_key" ON "StoreInvite"("code");

-- CreateIndex
CREATE INDEX "Outbox_storeId_id_idx" ON "Outbox"("storeId", "id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointLedger" ADD CONSTRAINT "PointLedger_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ClubMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointLedger" ADD CONSTRAINT "PointLedger_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "ClubMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreInvite" ADD CONSTRAINT "StoreInvite_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

