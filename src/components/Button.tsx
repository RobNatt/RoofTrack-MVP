interface Buttonprops extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary';
    children: React.ReactNode;
    className?: string;
}
export default function Button({ 
    variant = 'primary',
    children,
    className = '',
    ...props
 }: Buttonprops) {
    const baseStyles = "ml-4 text-xl px-4 py-2";
    const variantStyles = {
        primary: "p-3 px-5 rounded-3xl shadow-xl border-blue-900 bg-indigo-900 text-yellow-300 font-bold border-2 hover:scale-108 hover:shadow-2xl transition-all duration-300",
        secondary: "text-gray-800 underline hover:scale-102 cursor-not-allowed",
        tertiary: "bg-transparent border border-gray-300 text-gray-700"
    };
    return (
        <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
 }