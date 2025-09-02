import React, { useState, useMemo } from 'react';
import { auth, googleProvider } from '../firebase';
import { CompassIcon } from './icons/CompassIcon';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const backgroundUrl = useMemo(() => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop', []);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        await auth.createUserWithEmailAndPassword(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await auth.signInWithPopup(googleProvider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundUrl})` }}></div>
      <div className="relative flex justify-center items-center min-h-screen font-sans p-4">
        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden text-white animate-fade-in p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              <CompassIcon className="w-8 h-8 mr-3 text-teal-300" />
              <h1 className="text-3xl font-bold tracking-wider text-teal-200">My Journeys</h1>
            </div>
            <p className="text-gray-400 mt-2">Sign in to continue your adventure.</p>
          </div>

          {error && <p className="bg-red-500/30 text-red-300 text-center text-sm p-3 rounded-lg mb-4">{error}</p>}
          
          <form onSubmit={handleAuthAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-white/10 border-gray-600 rounded-md shadow-sm p-3 focus:ring-teal-500 focus:border-teal-500" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full bg-white/10 border-gray-600 rounded-md shadow-sm p-3 focus:ring-teal-500 focus:border-teal-500" required />
            </div>
            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300 disabled:bg-teal-800 flex items-center justify-center">
                {loading && <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>}
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400 rounded-full">Or continue with</span>
            </div>
          </div>
          
          <div>
            <button onClick={handleGoogleSignIn} disabled={loading} className="w-full bg-white/90 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-white transition-colors duration-300 disabled:bg-gray-300 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Sign in with Google
            </button>
          </div>

          <div className="text-center mt-6">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-teal-300 hover:text-teal-100 underline">
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;