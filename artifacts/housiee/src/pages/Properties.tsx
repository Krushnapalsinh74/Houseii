import { useState } from "react";
import { useListProperties } from "@workspace/api-client-react";
import { Link } from "wouter";
import { MapPin, Bed, Bath, Square, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Properties() {
  const [type, setType] = useState<string>("all");
  const [location, setLocation] = useState<string>("");
  
  const { data: result, isLoading } = useListProperties(
    type !== "all" ? { type } : {}
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Exclusive Properties</h1>
        
        {/* Filters */}
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border mb-12 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by location..." 
              className="pl-10 h-12 bg-background border-border"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 border-border">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full md:w-auto h-12 bg-secondary text-white hover:bg-secondary/90 px-8">
            Search
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {result?.properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <div className="group bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={property.images?.[0] || "/property-1.png"} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded">
                      {property.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-serif text-xl font-bold line-clamp-1">{property.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-6 border-t border-b border-border py-4">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Bed className="w-4 h-4 text-secondary" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Bath className="w-4 h-4 text-secondary" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Square className="w-4 h-4 text-secondary" />
                          <span>{property.area} {property.areaUnit}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-highlight">
                        ₹{property.price} {property.priceUnit}
                      </span>
                      <span className="text-sm font-medium text-secondary group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
