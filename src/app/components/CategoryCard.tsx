import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

export function CategoryCard({ icon: Icon, title, description, onClick }: CategoryCardProps) {
  return (
    <Card 
      className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 shadow-md group bg-gradient-to-br from-white to-gray-50"
      onClick={onClick}
    >
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}