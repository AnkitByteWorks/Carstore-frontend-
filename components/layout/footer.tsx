import Link from "next/link";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/[0.08] bg-[#050505]">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Car className="h-6 w-6 text-gold" />
                            <span className="font-playfair text-xl font-bold text-gradient-gold">
                                CARSTORE
                            </span>
                        </div>
                        <p className="text-sm text-slate-400">
                            The world&apos;s finest luxury cars. Delivered to your door.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link href="/cars" className="hover:text-gold transition">
                                    All Cars
                                </Link>
                            </li>
                            <li>
                                <Link href="/cars?brand=Ferrari" className="hover:text-gold transition">
                                    Ferrari
                                </Link>
                            </li>
                            <li>
                                <Link href="/cars?brand=Lamborghini" className="hover:text-gold transition">
                                    Lamborghini
                                </Link>
                            </li>
                            <li>
                                <Link href="/cars?brand=Porsche" className="hover:text-gold transition">
                                    Porsche
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link href="/about" className="hover:text-gold transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/showrooms" className="hover:text-gold transition">
                                    Showrooms
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-gold transition">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-gold transition">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gold mt-0.5" />
                                <span>123 Marine Drive, Mumbai</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gold" />
                                <span>+91 9876543210</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gold" />
                                <span>hello@carstore.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} Carstore. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                        <Link href="/privacy" className="hover:text-gold">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-gold">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}