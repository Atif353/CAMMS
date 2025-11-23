import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus, FiPhone, FiArrowRight, FiCheck, FiEye, FiEyeOff, FiActivity } from 'react-icons/fi';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'INSTRUCTOR',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signup(formData);

    if (result.success) {
      navigate('/login');
    }

    setLoading(false);
  };

  const passwordStrength = formData.password.length > 0 ? 
    formData.password.length < 6 ? 'weak' : 
    formData.password.length < 10 ? 'medium' : 'strong' : null;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden p-4 py-8">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/background.png')`,
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/50 to-indigo-900/60" />
      
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-white/15 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-2xl border-2 border-white/30 transform hover:scale-105 transition-transform duration-300">
                <FiActivity size={40} color="white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              Join CAMMS
            </h1>
            <p className="text-white/90 text-sm">
              Create your instructor account and start managing activities
            </p>
            <div className="mt-3 flex items-center justify-center space-x-1.5">
              <div className="h-0.5 w-8 bg-blue-400 rounded-full" />
              <div className="h-0.5 w-6 bg-indigo-400 rounded-full" />
              <div className="h-0.5 w-8 bg-purple-400 rounded-full" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2 flex items-center space-x-2">
                  <FiUser className="text-blue-300 text-sm" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-lg text-white placeholder-white/50 transition-all duration-300 ${
                    focusedField === 'name' 
                      ? 'border-blue-400 ring-4 ring-blue-500/30 bg-white/15 shadow-lg shadow-blue-500/20' 
                      : 'border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/30 focus:bg-white/15'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2 flex items-center space-x-2">
                  <FiMail className="text-blue-300 text-sm" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-lg text-white placeholder-white/50 transition-all duration-300 ${
                    focusedField === 'email' 
                      ? 'border-blue-400 ring-4 ring-blue-500/30 bg-white/15 shadow-lg shadow-blue-500/20' 
                      : 'border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/30 focus:bg-white/15'
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2 flex items-center space-x-2">
                  <FiLock className="text-blue-300 text-sm" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border-2 rounded-lg text-white placeholder-white/50 transition-all duration-300 ${
                      focusedField === 'password' 
                        ? 'border-blue-400 ring-4 ring-blue-500/30 bg-white/15 shadow-lg shadow-blue-500/20' 
                        : 'border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/30 focus:bg-white/15'
                    }`}
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === 'weak' ? 'bg-red-400 w-1/3' :
                          passwordStrength === 'medium' ? 'bg-yellow-400 w-2/3' :
                          'bg-green-400 w-full'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength === 'weak' ? 'text-red-300' :
                      passwordStrength === 'medium' ? 'text-yellow-300' :
                      'text-green-300'
                    }`}>
                      {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2 flex items-center space-x-2">
                  <FiPhone className="text-blue-300 text-sm" />
                  <span>Phone (Optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-lg text-white placeholder-white/50 transition-all duration-300 ${
                    focusedField === 'phone' 
                      ? 'border-blue-400 ring-4 ring-blue-500/30 bg-white/15 shadow-lg shadow-blue-500/20' 
                      : 'border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/30 focus:bg-white/15'
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-start space-x-2">
                <FiCheck className="text-green-400 text-sm mt-0.5 flex-shrink-0" />
                <p className="text-white/80 text-xs">
                  <span className="font-semibold">Instructor Account:</span> You're signing up as an Instructor. Only admins can create admin accounts.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-lg shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <FiUserPlus className="text-lg" />
                    <span>Create My Account</span>
                    <FiArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-white hover:text-blue-200 transition-colors duration-300 underline decoration-2 underline-offset-2 decoration-blue-400 hover:decoration-blue-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
