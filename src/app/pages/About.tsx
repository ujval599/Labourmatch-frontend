import { Target, Users, Award, Heart, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Trust & Reliability",
      description: "We verify every contractor to ensure you get reliable and trustworthy service",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a strong community of contractors and customers who trust each other",
    },
    {
      icon: Award,
      title: "Quality Service",
      description: "We maintain high standards to ensure quality work and customer satisfaction",
    },
    {
      icon: TrendingUp,
      title: "Growth & Opportunity",
      description: "Empowering contractors to grow their business and reach more customers",
    },
  ];

 
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About LabourMatch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to connect customers with trusted labour contractors, 
            making it easier to find reliable workers for construction, shifting, and daily work.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  LabourMatch was born from a simple observation: finding reliable labour contractors 
                  in India was unnecessarily difficult. Customers struggled to find trustworthy contractors, 
                  while skilled contractors struggled to reach customers.
                </p>
                <p>
                  We started LabourMatch in 2026 to bridge this gap. Our platform connects customers 
                  directly with verified labour contractors, making it easy to find the right team for 
                  any job - from construction and renovation to shifting and daily work.
                </p>
                <p>
                  Today, we're proud to serve thousands of customers and contractors across India, 
                  building trust and creating opportunities in the labour market.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1759984738054-cbdb13ec3fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjB0ZWFtJTIwaW5kaWF8ZW58MXx8fHwxNzczOTg3NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Construction workers"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To create a trusted platform that empowers labour contractors and makes it easy 
                  for customers to find reliable workers. We aim to bring transparency, trust, and 
                  efficiency to the labour market.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become India's most trusted labour marketplace, where every contractor is 
                  verified, every customer is satisfied, and opportunities are accessible to all. 
                  We envision a future where finding skilled workers is simple and reliable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

     
      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose LabourMatch?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "All contractors are verified with background checks",
              "Transparent pricing with no hidden charges",
              "Direct contact with contractors - no middlemen",
              "Real customer reviews and ratings",
              "Quick response time from contractors",
              "Support available to resolve any issues",
            ].map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
