-- CreateEnum
CREATE TYPE "TutorSubject" AS ENUM ('MATH', 'SCIENCE');

-- CreateTable
CREATE TABLE "TutorSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionsLeft" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorQuestion" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "subject" "TutorSubject" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TutorSession" ADD CONSTRAINT "TutorSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorQuestion" ADD CONSTRAINT "TutorQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TutorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
