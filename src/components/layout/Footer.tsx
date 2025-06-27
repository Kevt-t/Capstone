'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 pr-0">
            <h3 className="text-xl font-semibold mb-4">El Molino Tortilleria & Restaurant</h3>
            <p className="mb-2">1739 W Ritner St</p>
            <p className="mb-2">Philadelphia, PA 19145</p>
            <p className="mb-2">Phone: (215) 392-9047</p>
          </div>
          
          <div className="md:col-span-1 -ml-4 md:-ml-8 lg:-ml-12">
            <div className="h-full w-full rounded overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.8847271738096!2d-75.1793431246361!3d39.92159578562717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c7d3142aaae5%3A0x2a7ee92eb719b4ee!2sEl%20Molino%20Tortilleria%20%26%20Restaurant!5e0!3m2!1sen!2sus!4v1751012905583!5m2!1sen!2sus" 
                width="100%" 
                height="200" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="El Molino Tortilleria & Restaurant Location"
                className="rounded"
              />
            </div>
          </div>
          
          <div className="md:ml-4">
            <h3 className="text-xl font-semibold mb-4">Hours</h3>
            <p className="mb-2">Monday - Tuesday: 3PM - 9PM</p>
            <p className="mb-2">Wednesday: Closed</p>
            <p className="mb-2">Thursday - Sunday: 3PM - 9PM</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="hover:text-primary">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {currentYear} El Molino Tortilleria & Restaurant. All rights reserved.</p>
          <p className="text-sm mt-2">Powered by Square</p>
        </div>
      </div>
    </footer>
  );
}
