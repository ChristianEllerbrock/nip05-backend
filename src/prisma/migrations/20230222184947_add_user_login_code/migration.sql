BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UserLoginCode] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL,
    [validUntil] DATETIME2 NOT NULL,
    CONSTRAINT [UserLoginCode_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UserLoginCode_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserLoginCode] ADD CONSTRAINT [UserLoginCode_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH