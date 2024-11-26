import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext"; // Import your AuthContext
import { useNavigate } from "react-router-dom";
const AdminProfile = () => {
  const { admin } = useAuth(); // Get admin state from AuthContext
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      // Only fetch data if admin is logged in
      const fetchData = async () => {
        try {
          // Fetch all users
          const usersResponse = await axios.get(
            "http://localhost:5000/api/users"
          );
          setUsers(usersResponse.data.users);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Could not fetch data");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false); // Stop loading if no admin is logged in
    }
  }, [admin]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId)); // Remove user from list
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!admin) {
    navigate("/admin/login");
    return <p>You need to be logged in as an admin to view this page.</p>;
  }

  return (
    <div className="p-4 mt-12 mb-4 max-w-4xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>

      {admin ? (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Admin Details</h3>
          <p className="mb-2">
            <strong>Name:</strong> {admin.username}
          </p>
          <p className="mb-4">
            <strong>Email:</strong> {admin.email}
          </p>
        </div>
      ) : (
        <p>No admin details available</p>
      )}

      <h3 className="text-xl font-semibold mb-4">Users of the system</h3>
      {error && <p className="text-red-500">{error}</p>}
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white rounded py-1 px-2 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default AdminProfile;
