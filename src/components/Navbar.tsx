import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Dumbbell className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">GoalFit</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tableau de bord
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;