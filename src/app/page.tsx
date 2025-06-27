import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Featured menu categories
  const featuredCategories = [
    {
      name: "Starters",
      image: "/images/Empanadas.webp",
      description: "Perfect for sharing"
    },
    {
      name: "Main Courses",
      image: "/images/Tacos.webp",
      description: "Signature dishes"
    },
    {
      name: "Desserts",
      image: "/images/Flan.webp",
      description: "Sweet finishes"
    }
  ];

  // Rating platforms
  const ratingPlatforms = [
    {
      name: "Grubhub",
      rating: "4.8",
      logo: "/images/Grubhub_Logo.webp",
      color: "#FF8000",
      url: "https://www.grubhub.com/restaurant/el-molino-tortilleria--restaurant-1739-w-ritner-st-philadelphia/3359395"
    },
    {
      name: "DoorDash",
      rating: "4.7",
      logo: "/images/Doordash_Logo.webp",
      color: "#FF3008",
      url: "https://www.doordash.com/store/el-molino-tortilleria-&-restaurant-philadelphia-2518907/2517484/?srsltid=AfmBOopTX-2ptxGBFSFzU8VnpmKv-47kefGFvQ3iA76_qc7fyccmoHoH"
    },
    {
      name: "Uber Eats",
      rating: "4.8",
      logo: "/images/Uber_Eats_Logo.webp",
      color: "#06C167",
      url: "https://www.ubereats.com/store/el-molino-tortilleria-%26-restaurant/vKIgZXXrUS6-7bJJuATWwA?srsltid=AfmBOordF4G2MNhf4yAov0cOiHuwMQaO5rriaVKKRE-jN0qulTuM_Vqj"
    },
    {
      name: "Google",
      rating: "4.8",
      logo: "/images/Google_G_Logo.webp",
      color: "#4285F4",
      url: "https://g.co/kgs/UnsRTxY"
    }
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section with Background Image */}
      <section className="w-full relative">
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
        
        <div className="relative h-[70vh] min-h-[500px] w-full">
          <Image
            src="/images/Hero image.webp"
            alt="El Molino Tortilleria & Restaurant - Fresh handmade tortillas. South Philadelphia, PA"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 px-4 md:px-6 text-center">
          <div className="flex flex-col items-center space-y-6 text-white">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Hecho a mano.<br /> Served with love.
              </h1>
              <p className="max-w-[700px] text-lg md:text-xl/relaxed lg:text-2xl/relaxed">
                Where every taco starts with a fresh masa tortilla.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Link 
                href="/menu" 
                className="bg-primary text-text-dark text-lg px-8 py-4 rounded-full font-medium transition-all hover:bg-primary-dark hover:scale-105"
              >
                Order Now
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-white bg-transparent border-2 border-white px-8 py-4 rounded-full font-medium transition-all hover:bg-secondary hover:text-text-dark hover:border-secondary"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Explore Our Menu
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
              From starters to desserts, we have something for everyone.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category, index) => (
              <Link href="/menu" key={index} className="group">
                <div className="relative overflow-hidden rounded-xl">
                  <div className="aspect-[4/3] w-full relative">
                    <Image 
                      src={category.image} 
                      alt={category.name}
                      fill 
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      <p>{category.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Link 
              href="/menu" 
              className="text-primary font-medium text-lg flex items-center gap-2 hover:underline"
            >
              View Full Menu
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Customer Ratings */}
      <section className="w-full py-16 md:py-24 bg-sky-blue bg-opacity-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Our Customers Love Us
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
              Consistently top-rated across all delivery platforms
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {ratingPlatforms.map((platform, index) => (
              <a 
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm border-t-4 transition-transform hover:scale-105 hover:shadow-md"
                style={{ borderColor: platform.color }}
              >
                <div className="w-16 h-16 relative mb-4">
                  <Image 
                    src={platform.logo}
                    alt={`${platform.name} logo`}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold mr-1">{platform.rating}</span>
                  <span className="text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <p className="text-lg font-medium">stars</p>
              </a>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-text-light italic">
              "The best authentic Mexican food in South Philly!"
            </p>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="w-full py-16 md:py-24 bg-sandy-beige bg-opacity-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              How It Works
            </h2>
            <p className="max-w-[700px] text-text-light md:text-xl/relaxed">
              Four simple steps to get your favorite meals ready when you are.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-xl bg-white transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-text-dark text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold">Browse the Menu</h3>
              <p className="text-center text-text-light">
                Explore our full menu of fresh and delicious offerings.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-xl bg-white transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-text-dark text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold">Add to Your Cart</h3>
              <p className="text-center text-text-light">
                Select your items and customize as needed.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-xl bg-white transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-text-dark text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold">Checkout Securely</h3>
              <p className="text-center text-text-light">
                Pay quickly and securely with Square.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-xl bg-white transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-text-dark text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold">Pick Up Your Order</h3>
              <p className="text-center text-text-light">
                Skip the line and grab your order when it's ready.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-sky-blue to-sandy-beige text-text-dark">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
            Hungry? Order Now!
          </h2>
         
          <Link 
            href="/menu" 
            className="bg-accent text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-opacity-90 hover:scale-105"
          >
            Start Ordering
          </Link>
        </div>
      </section>
    </div>
  );
}
