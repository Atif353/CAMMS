import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { userApi } from '../../api/userApi';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';
import { FiUsers, FiUserPlus, FiEdit, FiTrash2, FiUser, FiMail, FiShield, FiPhone, FiMoreVertical, FiSearch } from 'react-icons/fi';
import { getProfileImage } from '../../utils/profileImage';
import { useToast } from '../../components/Toast';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [openMenuId, setOpenMenuId] = useState(null);
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'INSTRUCTOR',
    phone: '',
    isActive: true,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (searchTerm) params.search = searchTerm;
      const response = await userApi.getAll(params);
      setUsers(response.data.data);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'INSTRUCTOR', phone: '', isActive: true });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role, phone: user.phone || '', isActive: user.isActive });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userApi.update(editingUser.id, formData);
        toast.success('User updated successfully');
      } else {
        await userApi.create(formData);
        toast.success('User created successfully');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#545454',
    });

    if (result.isConfirmed) {
      try {
        await userApi.delete(id);
        toast.success('User has been deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiUsers className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Manage Users</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-1">Create, edit, and manage system users</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial md:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all duration-300 font-medium text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={handleCreate}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <FiUserPlus />
                <span>Create New User</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <FiUser />
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                    <div className="flex items-center space-x-2">
                      <FiMail />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <FiShield />
                      <span>Role</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                          src={user.profile_image ? `${user.profile_image}?t=${Date.now()}` : getProfileImage(user, user.id)}
                          alt={user.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=40`;
                          }}
                        />
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">{user.name}</span>
                          <span className="text-xs text-gray-500 sm:hidden">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 flex items-center space-x-1 w-fit">
                        <FiShield className="text-xs" />
                        <span>{user.role}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                      <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 inline-flex text-xs leading-5 font-bold rounded-full ${
                          user.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Actions"
                        >
                          <FiMoreVertical className="text-sm sm:text-base" />
                        </button>
                        {openMenuId === user.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-30 py-1">
                              <button
                                onClick={() => {
                                  handleEdit(user);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2 transition-colors"
                              >
                                <FiEdit className="text-base" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(user.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-700 flex items-center space-x-2 transition-colors"
                              >
                                <FiTrash2 className="text-base" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full animate-slideUp border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                {editingUser ? (
                  <>
                    <FiEdit className="text-blue-600" />
                    <span>Edit User</span>
                  </>
                ) : (
                  <>
                    <FiUserPlus className="text-blue-600" />
                    <span>Create New User</span>
                  </>
                )}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                    <FiUser />
                    <span>Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                    <FiMail />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                    <FiPhone />
                    <span>Phone (Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                    <FiShield />
                    <span>Role</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  >
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                {editingUser && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Status</label>
                    <select
                      value={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageUsersPage;

