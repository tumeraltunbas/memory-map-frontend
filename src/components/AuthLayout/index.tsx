interface AuthLayoutProps {
   children: React.ReactNode;
   title: string;
   subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
   return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="text-3xl font-bold text-center text-[#2D3748] mb-2">
               Memory Map
            </h1>
            <h2 className="mt-6 text-2xl font-semibold text-center text-gray-900">
               {title}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
               {children}
            </div>
         </div>
      </div>
   );
};
