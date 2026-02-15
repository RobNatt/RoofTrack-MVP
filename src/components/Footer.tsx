'use client';
import { useRouter } from 'next/navigation';

export default function Footer() {
    const router = useRouter();
    const currentYear = new Date().getFullYear();

    return (
        <footer className=" text-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <img 
                            src="/RoofTrack.png" 
                            alt="RoofStack Logo" 
                            className="h-12 w-auto object-contain mb-3"
                        />
                        <p className="text-gray-800 text-sm">
                            Territory management and lead tracking for roofing sales teams.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Product</h3>
                        <ul className="space-y-2 text-gray-800 text-sm">
                            <li>
                                <button 
                                    onClick={() => router.push('/dashboard')}
                                    className="hover:text-gray-600 transition-colors"
                                >
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => router.push('/dashboard/leads')}
                                    className="hover:text-gray-600 transition-colors"
                                >
                                    Leads
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => router.push('/dashboard/territoryManagement')}
                                    className="hover:text-gray-600 transition-colors"
                                >
                                    Territory Map
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Company</h3>
                        <ul className="space-y-2 text-gray-800 text-sm">
                            <li>
                                <button 
                                    onClick={() => router.push('/')}
                                    className="hover:text-gray-600 transition-colors"
                                >
                                    About
                                </button>
                            </li>
                            <li>
                                <a 
                                    href="https://github.com/RobNatt/RoofTrack-MVP" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-600 transition-colors"
                                >
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="mailto:support@roofstack.com"
                                    className="hover:text-gray-600 transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Legal</h3>
                        <ul className="space-y-2 text-gray-800 text-sm">
                            <li>
                                <button 
                                    onClick={() => alert('Privacy Policy - Coming soon')}
                                    className="hover:text-gray-600 transition-colors"
                                >
                                    Privacy Policy
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => alert('Terms of Service - Coming soon')}
                                    className="hover:text-gray-600 transition-colors"
                                >
                                    Terms of Service
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-300 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-800 text-sm">
                        © {currentYear} RoofStack. All rights reserved.
                    </p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a 
                            href="https://github.com/RobNatt" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text- transition-colors"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/robert-nattrass-535a743aa" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text- transition-colors"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
