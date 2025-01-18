CREATE TYPE "public"."order_status" AS ENUM('created', 'cancelled', 'complete', 'awaiting:payment');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"ticketId" integer NOT NULL,
	"status" "order_status" DEFAULT 'created' NOT NULL,
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now()
);
