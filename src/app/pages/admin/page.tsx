"use client";

import { useAuth } from "../../context/auth-context";
import Link from "next/link";

const DashboardPage = () => {
  // const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth();

  console.log(user);

  return (
    <div>
      <h1>DashBoard</h1>
      <p> Bonjour {user?.email}</p>
      {user ? (
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          se deconnecter{" "}
        </button>
      ) : (
        <Link href="/pages/login">Se connecter</Link>
      )}
    </div>
  );
};

export default DashboardPage;
