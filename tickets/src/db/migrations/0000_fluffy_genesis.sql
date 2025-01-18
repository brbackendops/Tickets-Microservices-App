CREATE TABLE "tickets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tickets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(200) NOT NULL,
	"price" numeric DEFAULT '0.00' NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
