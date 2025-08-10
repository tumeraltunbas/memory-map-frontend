import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/authApi';
import { AuthLayout } from '../AuthLayout';

export const ForgotPassword = () => {
   const [email, setEmail] = useState('');
   const [submitted, setSubmitted] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return;
      try {
         setIsSubmitting(true);
         await authAPI.forgotPassword(email);
         setSubmitted(true);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <AuthLayout
         title="Forgot your password?"
         subtitle="Enter your email to receive a reset link"
      >
         {submitted ? (
            <div className="space-y-6">
               <p className="text-sm text-gray-700">
                  If an account exists for <strong>{email}</strong>, we've sent
                  a password reset link.
               </p>
               <div className="text-sm text-center">
                  <Link
                     to="/login"
                     className="font-medium text-[#9E7B9B] hover:text-[#8B6B8B]"
                  >
                     Back to sign in
                  </Link>
               </div>
            </div>
         ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
               <div>
                  <label
                     htmlFor="email"
                     className="block text-sm font-medium text-gray-700"
                  >
                     Email address
                  </label>
                  <div className="mt-1">
                     <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#9E7B9B] focus:border-[#9E7B9B] sm:text-sm"
                     />
                  </div>
               </div>

               <div>
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isSubmitting
                           ? 'bg-[#9E7B9B]/60 cursor-not-allowed'
                           : 'bg-[#9E7B9B] hover:bg-[#8B6B8B] focus:ring-[#9E7B9B]'
                     }`}
                  >
                     {isSubmitting ? 'Sending…' : 'Send reset link'}
                  </button>
               </div>

               <div className="text-sm text-center">
                  <Link
                     to="/login"
                     className="font-medium text-[#9E7B9B] hover:text-[#8B6B8B]"
                  >
                     Back to sign in
                  </Link>
               </div>
            </form>
         )}
      </AuthLayout>
   );
};
