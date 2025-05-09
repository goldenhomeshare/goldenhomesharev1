import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectCategory } from "../components/SelectCategory";
import { Textarea } from "@/components/ui/textarea";
import { TipTapEditor } from "../components/Editor";
import { UploadDropzone } from "../lib/uploadthing";
import { Button } from "@/components/ui/button";

export default function ListRoute() {
    return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
        <Card>
            <form>
                <CardHeader>
                <CardTitle>Turn your spare room into help</CardTitle>
                    <CardDescription >
                    Describe your home here in detail here to make connecting easy!
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-10">
                    <div className="flex flex-col gap-y-4">
                        <Label>Title</Label>
                        <Input type="text" placeholder="Title of your Listing"/>            
                    </div>
                    <div className="flex flex-col gap-y-2">
                    <Label>Category</Label>
                    <SelectCategory />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Price</Label>
                        <Input placeholder="$325" type="number" />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <Label>Details</Label>
                        <Textarea placeholder="Add a brief summary about your home here"/>
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <Label>Description</Label>
                        <TipTapEditor setJson={undefined} json={null} />
                    </div>
                    
                    <div className="flex flex-col gap-y-2">
                        <Label>Home Images (upload pictures of your space)</Label>
                        <UploadDropzone endpoint="imageUploader" />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <Label>Important Files (optional)</Label>
                        <UploadDropzone endpoint="productFileUpload" />
                    </div>

                </CardContent>
                <CardFooter className="mt-5">
                <Button>Submit form</Button>
                </CardFooter>
            </form>
        </Card>

</section>
    ); 
}