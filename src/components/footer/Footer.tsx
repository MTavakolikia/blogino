import Link from 'next/link'
import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function Footer() {
    return (
        <footer className="mt-12 bg-gray-900 text-white py-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">About Us</h2>
                    <p className="text-gray-400 text-sm">Stay updated with the latest news and insights from our blog.</p>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Quick Links</h2>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li><Link href="#" className="hover:text-white">Home</Link></li>
                        <li><Link href="#" className="hover:text-white">Categories</Link></li>
                        <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
                        <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Follow Us</h2>
                    <div className="flex space-x-4">
                        <Link href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></Link>
                        <Link href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></Link>
                        <Link href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></Link>
                        <Link href="#" className="text-gray-400 hover:text-white"><Linkedin size={20} /></Link>
                    </div>
                </div>
            </div>
            <div className="mt-6 border-t border-gray-700 text-center pt-4 text-gray-400 text-sm">
                © {new Date().getFullYear()} Blog. All rights reserved.
            </div>
        </footer>)
}

export default Footer