import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Order Online for Quick Pickup
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Fresh, delicious food ready when you are. Skip the line with our easy online ordering.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link 
                href="/menu" 
                className="btn-primary"
              >
                View Our Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  How It Works
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our online ordering system makes grabbing your favorite dishes quick and simple.
                </p>
              </div>
            </div>
            <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
              <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-background">
                <div className="p-2 bg-primary bg-opacity-10 rounded-full text-primary">
                  1
                </div>
                <h3 className="text-xl font-bold">Browse the Menu</h3>
                <p className="text-center text-gray-500">
                  Explore our full menu of fresh and delicious offerings.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-background">
                <div className="p-2 bg-primary bg-opacity-10 rounded-full text-primary">
                  2
                </div>
                <h3 className="text-xl font-bold">Add to Your Cart</h3>
                <p className="text-center text-gray-500">
                  Select your items and customize as needed.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-background">
                <div className="p-2 bg-primary bg-opacity-10 rounded-full text-primary">
                  3
                </div>
                <h3 className="text-xl font-bold">Checkout Securely</h3>
                <p className="text-center text-gray-500">
                  Pay quickly and securely with Square.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-background">
                <div className="p-2 bg-primary bg-opacity-10 rounded-full text-primary">
                  4
                </div>
                <h3 className="text-xl font-bold">Pick Up Your Order</h3>
                <p className="text-center text-gray-500">
                  Skip the line and grab your order when it's ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
