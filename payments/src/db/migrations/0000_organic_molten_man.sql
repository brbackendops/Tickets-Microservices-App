CREATE TYPE "public"."order_status" AS ENUM('created', 'cancelled', 'complete', 'awaiting:payment', 'charge:created');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"version" integer NOT NULL,
	"userId" integer NOT NULL,
	"status" "order_status" DEFAULT 'created' NOT NULL,
	"price" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"orderId" integer NOT NULL,
	"stripeId" varchar(255) NOT NULL
);
