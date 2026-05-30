import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

export default function Projects() {
  const { data: projects, isLoading } = useListProjects();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Premium Projects</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={project.images?.[0] || "/project-1.png"} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded">
                      {project.status}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-2">{project.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                    <div className="text-sm font-medium mb-4 text-primary">
                      By {project.builderName}
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div className="text-lg font-bold text-highlight">
                        {project.minPrice && project.maxPrice 
                          ? `₹${project.minPrice} - ₹${project.maxPrice}`
                          : "Price on Request"
                        }
                      </div>
                      <span className="text-secondary text-sm font-medium">View Project →</span>
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
