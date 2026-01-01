-- CreateTable
CREATE TABLE "Collabraters" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Collabraters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Collabraters" ADD CONSTRAINT "Collabraters_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collabraters" ADD CONSTRAINT "Collabraters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
