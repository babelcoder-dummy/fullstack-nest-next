BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000),
    [password] NVARCHAR(1000) NOT NULL,
    [refreshToken] NVARCHAR(1000),
    [role] INT NOT NULL CONSTRAINT [User_role_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [User_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email]),
    -- CONSTRAINT [User_refreshToken_key] UNIQUE NONCLUSTERED ([refreshToken])
);

-- CreateIndex
CREATE UNIQUE NONCLUSTERED INDEX [idx_refreshToken_notnull]
ON [dbo].[User](refreshToken)
WHERE [refreshToken] IS NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Address] (
    [id] INT NOT NULL IDENTITY(1,1),
    [houseNumber] NVARCHAR(1000) NOT NULL,
    [village] NVARCHAR(1000),
    [road] NVARCHAR(1000) NOT NULL,
    [district] NVARCHAR(1000) NOT NULL,
    [province] NVARCHAR(1000) NOT NULL,
    [postalCode] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Address_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Address_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Address_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Address_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [desc] NVARCHAR(1000) NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Product_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Product_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Product_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[Category] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [desc] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Category_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Category_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Category_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Category_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Order_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Order_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OrderItem] (
    [id] INT NOT NULL IDENTITY(1,1),
    [quantity] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [orderId] INT NOT NULL,
    [productId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [OrderItem_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [OrderItem_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [OrderItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_CategoryToProduct] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CategoryToProduct_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_CategoryToProduct_B_index] ON [dbo].[_CategoryToProduct]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Address] ADD CONSTRAINT [Address_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CategoryToProduct] ADD CONSTRAINT [_CategoryToProduct_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Category]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CategoryToProduct] ADD CONSTRAINT [_CategoryToProduct_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Product]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
