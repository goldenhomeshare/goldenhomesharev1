import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "./DeleteProductButton";

interface iAppProps {
  images: string[];
  name: string;
  price: number;
  smallDescription: string;
  id: string;
  showEditButton?: boolean;
}

export function ProductCard({
  images,
  id,
  price,
  smallDescription,
  name,
  showEditButton = false,
}: iAppProps) {
  return (
    <div className="rounded-lg">
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {images.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[230px]">
                <Image
                  alt="Product image"
                  src={item}
                  fill
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>

      <div className="flex justify-between items-center mt-2">
        <h1 className="font-semibold text-xl">{name}</h1>
        <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset  ring-primary/10">
          ${price}
        </h3>
      </div>

      {showEditButton ? (
        <div className="flex gap-2 mt-5">
          <Button asChild className="flex-1">
            <Link href={`/product/${id}`}>View Listing</Link>
          </Button>
          <Button asChild variant="outline" size="icon">
            <Link href={`/sell/edit/${id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteProductButton productId={id} productName={name} />
        </div>
      ) : (
        <Button asChild className="w-full mt-5">
          <Link href={`/product/${id}`}>Learn More!</Link>
        </Button>
      )}
    </div>
  );
}

export function LoadingProductCard() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-[230px]" />
      <div className="flex flex-col mt-2 gap-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="w-full h-6" />
      </div>

      <Skeleton className="w-full h-10 mt-5" />
    </div>
  );
}