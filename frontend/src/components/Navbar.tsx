import { Link } from "react-router-dom";

 

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="font-bold text-xl">📈 Portfolio Tracker</h1>
      <div className="space-x-6">
        <Link to="/trade">Trade</Link>
        <Link to="/position">Position</Link>
        <Link to="/pnl">Realized P&L</Link>
      </div>
    </nav>
  );
};

export default Navbar;
