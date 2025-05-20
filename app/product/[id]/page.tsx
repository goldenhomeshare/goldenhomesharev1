import { BuyProduct } from "@/app/actions";
import { ProductDescription } from "@/app/components/ProductDescription";
import { BuyButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { JSONContent } from "@tiptap/react";
import Image from "next/image";
import { Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen } from "lucide-react";

const amenityIcons: Record<string, any> = {
  parking: { icon: Car, label: "Parking" },
  wifi: { icon: Wifi, label: "WiFi" },
  kitchen: { icon: Utensils, label: "Kitchen Access" },
  tv: { icon: Tv, label: "TV" },
  ac: { icon: Snowflake, label: "Air Conditioning" },
  heating: { icon: Sun, label: "Heating" },
  privateBathroom: { icon: Bath, label: "Private Bathroom" },
  privateEntrance: { icon: DoorOpen, label: "Private Entrance" },
};

async function getData(id: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      category: true,
      description: true,
      smallDescription: true,
      name: true,
      images: true,
      price: true,
      createdAt: true,
      id: true,
      amenities: true,
      User: {
        select: {
          profileImage: true,
          firstName: true,
        },
      },
    },
  });
  return data;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
  
  // Extract amenities or use empty array if not available
  const amenities = (data?.amenities as string[] | null) || [];
  
  return (
    <section className="mx-auto px-4  lg:mt-10 max-w-7xl lg:px-8 lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
      <Carousel className=" lg:row-end-1 lg:col-span-4">
        <CarouselContent>
          {data?.images.map((item, index) => (
            <CarouselItem key={index}>
              <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
                <Image
                  src={item as string}
                  alt="yoo"
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

      <div className="max-w-2xl mx-auto mt-5 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {data?.name}
        </h1>

        <p className="mt-2 text-muted-foreground">{data?.smallDescription}</p>
        <form action={BuyProduct}>
          <input type="hidden" name="id" value={data?.id} />
          <BuyButton price={data?.price as number} />
        </form>

        <div className="border-t border-gray-200 mt-10 pt-10">
          <div className="grid grid-cols-2 w-full gap-y-3">
            <h3 className="text-sm font-medium text-muted-foreground col-span-1">
              Released:
            </h3>
            <h3 className="text-sm font-medium col-span-1">
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "long",
              }).format(data?.createdAt)}
            </h3>

            <h3 className="text-sm font-medium text-muted-foreground col-span-1">
              Category:
            </h3>

            <h3 className="text-sm font-medium col-span-1">{data?.category}</h3>
          </div>
        </div>

        {amenities.length > 0 && (
          <>
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-base font-medium mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenityId) => {
                  const amenity = amenityIcons[amenityId];
                  if (!amenity) return null;
                  
                  const Icon = amenity.icon;
                  return (
                    <div key={amenityId} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Icon size={16} className="text-slate-600" />
                      </div>
                      <span className="text-sm">{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="border-t border-gray-200 mt-10"></div>
      </div>

      <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4">
        <ProductDescription content={data?.description as JSONContent} />
      </div>
    </section>
  );
}