-- DropForeignKey
ALTER TABLE "Professor" DROP CONSTRAINT "Professor_universityId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_professorId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_universityId_fkey";

-- AlterTable
ALTER TABLE "Professor" ALTER COLUMN "universityId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "professorId" DROP NOT NULL,
ALTER COLUMN "universityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;
