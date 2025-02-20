import React from 'react'

function Footer() {
    return (
        <footer className="mt-12 bg-cyan-900 text-white py-6">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
                <p className="text-sm">© {new Date().getFullYear()} Blog. All rights reserved.</p>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                    <a href="#" className="text-gray-400 hover:text-white">Contact</a>
                </div>
            </div>
        </footer>)
}

export default Footer