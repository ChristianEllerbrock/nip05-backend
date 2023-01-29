/*
  Warnings:

  - You are about to drop the column `code` on the `AuthRegistration` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AuthRegistration] DROP COLUMN [code];

-- CreateTable
CREATE TABLE [dbo].[AuthRegistrationCode] (
    [id] NVARCHAR(1000) NOT NULL,
    [authRegistrationId] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AuthRegistrationCode_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AuthRegistrationCode_authRegistrationId_key] UNIQUE NONCLUSTERED ([authRegistrationId])
);

-- CreateTable
CREATE TABLE [dbo].[FraudAuthRegistration] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [reportedAt] DATETIME2 NOT NULL,
    CONSTRAINT [FraudAuthRegistration_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FraudAuthRegistration_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[AuthRegistrationCode] ADD CONSTRAINT [AuthRegistrationCode_authRegistrationId_fkey] FOREIGN KEY ([authRegistrationId]) REFERENCES [dbo].[AuthRegistration]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
