// components/Navbar.jsx
import Link from 'next/link';
import { FaHome, FaPlus, FaList } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 flex items-center justify-between">
      <div className="text-white font-bold text-xl">
        <Link href="/dashboard/destinations">Destination Dashboard</Link>
      </div>
      <div className="flex space-x-4">
        <Link href="/dashboard/destinations">
          <FaList className="text-white w-5 h-5" title="Destinations" />
        </Link>
        <Link href="/dashboard/destinations/create">
          <FaPlus className="text-white w-5 h-5" title="Add Destination" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
