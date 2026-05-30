export default function About() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-center">About HOUSIEE.IN</h1>
          
          <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl relative">
            <div className="absolute inset-0 bg-primary/20 z-10" />
            <img src="/hero.png" alt="About Housiee" className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-xl leading-relaxed text-muted-foreground font-medium mb-8">
              HOUSIEE.IN was founded with a single mission: to transform the real estate experience in Ahmedabad from a transactional process into a premium, luxury journey.
            </p>
            
            <h2 className="font-serif text-2xl font-bold mt-12 mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To be the most trusted and sought-after luxury real estate advisory in Gujarat, known for our uncompromising integrity, deep market knowledge, and unparalleled service.
            </p>

            <h2 className="font-serif text-2xl font-bold mt-12 mb-4">Why We Are Different</h2>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
              <li><strong>Curated Portfolio:</strong> We don't list everything. We list the best.</li>
              <li><strong>Absolute Transparency:</strong> No hidden costs, no surprises. Just honest advice.</li>
              <li><strong>End-to-End Service:</strong> From discovery to legal documentation and beyond.</li>
              <li><strong>Deep Local Expertise:</strong> We know Ahmedabad better than anyone else.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
