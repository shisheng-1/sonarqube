CREATE TABLE "PORTFOLIO_PROJECTS"(
    "UUID" VARCHAR(40) NOT NULL,
    "PORTFOLIO_UUID" VARCHAR(40) NOT NULL,
    "PROJECT_UUID" VARCHAR(40) NOT NULL,
    "BRANCH_UUID" VARCHAR(40),
    "CREATED_AT" BIGINT NOT NULL
);
ALTER TABLE "PORTFOLIO_PROJECTS" ADD CONSTRAINT "PK_PORTFOLIO_PROJECTS" PRIMARY KEY("UUID");