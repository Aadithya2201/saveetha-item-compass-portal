
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useItemStore } from "@/hooks/useItemStore";
import { useTheme } from "@/hooks/useTheme";
import { Check, Search } from "lucide-react";
import ItemCard from "@/components/items/ItemCard";
import MainLayout from "@/components/layout/MainLayout";

const Index = () => {
  const { items } = useItemStore();
  const { theme } = useTheme();
  const [recentItems, setRecentItems] = useState<typeof items>([]);

  // Get recent items on component mount
  useEffect(() => {
    // Sort items by createdAt date and take the most recent 4
    const recent = [...items]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
    
    setRecentItems(recent);
  }, [items]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-college/90 to-college-dark/80 rounded-xl" />
        <div className="relative py-16 px-6 sm:px-12 md:py-24 rounded-xl overflow-hidden">
          {/* Pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Saveetha Item Compass
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              The official lost and found portal for Saveetha Engineering College. Report lost items, find missing belongings, and help others recover their possessions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                asChild
                className="bg-white text-college hover:bg-gray-100"
              >
                <Link to="/login">Get Started</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-white text-white hover:bg-white/20"
              >
                <Link to="/items">Browse Items</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform makes it easy to report and find lost items on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="bg-college/10 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Search className="h-8 w-8 text-college" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Report an Item</h3>
            <p className="text-muted-foreground">
              Report lost or found items with details and photos. Tag items as normal or emergency.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="bg-college/10 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Search className="h-8 w-8 text-college" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Search the Database</h3>
            <p className="text-muted-foreground">
              Browse through reported items or search by specific criteria to find what you're looking for.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="bg-college/10 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Check className="h-8 w-8 text-college" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Claim Your Item</h3>
            <p className="text-muted-foreground">
              Contact the finder through provided details and arrange to collect your item.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      {recentItems.length > 0 && (
        <section className="py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recently Posted Items</h2>
            <Button variant="outline" asChild>
              <Link to="/items">View All Items</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className={`rounded-xl p-8 md:p-12 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Lost Something or Found an Item?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Help your fellow students by reporting lost or found items. It only takes a minute!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-college hover:bg-college-dark">
              <Link to="/dashboard">Post an Item</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
