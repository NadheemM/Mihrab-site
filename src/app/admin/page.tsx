import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import Contact from '@/models/Contact';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await connectToDatabase();
  
  const unapprovedBusinesses = await Business.find({ isApproved: false }).sort({ createdAt: -1 });
  const contacts = await Contact.find({}).sort({ createdAt: -1 });

  return (
    <div className="container" style={{ padding: '6rem 2rem' }}>
      <AdminDashboard 
        initialBusinesses={JSON.parse(JSON.stringify(unapprovedBusinesses))} 
        initialContacts={JSON.parse(JSON.stringify(contacts))} 
      />
    </div>
  );
}
