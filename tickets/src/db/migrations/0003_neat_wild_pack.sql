CREATE SEQUENCE ticket_version_seq START 1;
ALTER TABLE "tickets" ALTER COLUMN "version" SET DEFAULT nextval('ticket_version_seq');