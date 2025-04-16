import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const games = [
  { id: 1, title: "Cyberpunk 2077", price: "199 PLN", image: "cyberpunk.jpg" },
  { id: 2, title: "Elden Ring", price: "249 PLN", image: "eldenring.jpg" },
  { id: 3, title: "The Witcher 3", price: "99 PLN", image: "witcher3.jpg" },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">PlayQuest - Sklep z grami</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="shadow-lg">
            <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{game.title}</h2>
              <p className="text-gray-700">{game.price}</p>
              <Button className="mt-2 w-full flex items-center justify-center gap-2">
                <ShoppingCart size={16} /> Dodaj do koszyka
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
