CREATE TABLE "GROUPS"(
    "NAME" VARCHAR(500) NOT NULL,
    "DESCRIPTION" VARCHAR(200),
    "CREATED_AT" TIMESTAMP,
    "UPDATED_AT" TIMESTAMP,
    "UUID" VARCHAR(40) NOT NULL
);
ALTER TABLE "GROUPS" ADD CONSTRAINT "PK_GROUPS" PRIMARY KEY("UUID");