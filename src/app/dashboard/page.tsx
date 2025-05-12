import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/server/db'
import DashboardHeader from '@/components/DashboardHeader'
import FamilyTreeList from '@/components/FamilyTreeList'
import CreateFamilyTreeButton from '@/components/CreateFamilyTreeButton'
import AnimatedDashboardIntro from '@/components/AnimatedDashboardIntro'

export default async function Dashboard() {
  const session = await auth();
  
  // If user is not logged in, redirect to homepage
  if (!session?.user) {
    redirect('/');
  }
  
  // Fetch user's family trees
  const familyTrees = await prisma.familyTree.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Family Trees</h1>
          <CreateFamilyTreeButton />
        </div>
        
        {familyTrees.length === 0 ? (
          <AnimatedDashboardIntro />
        ) : (
          <FamilyTreeList familyTrees={familyTrees} />
        )}
      </main>
    </div>
  );
} 