"use client";

import {
    ImagePlus,
    X,
    Loader2
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    uploadImage
} from "@/services/upload.service";

import {
    Button
} from "@/components/ui/button";


interface Props {

    value?: string | null;

    onChange: (path: string | null) => void;

}



export default function ImageUploader({

    value,
    onChange,

}: Props) {


    const inputRef =
        useRef<HTMLInputElement>(null);


    const [preview, setPreview] =
        useState<string | null>(
            value ?? null
        );


    const [uploading, setUploading] =
        useState(false);



    useEffect(() => {

        setPreview(
            value ?? null
        );

    }, [value]);




    async function upload(
        file: File
    ) {


        try {


            setUploading(true);


            const localPreview =
                URL.createObjectURL(file);


            setPreview(localPreview);



            const formData =
                new FormData();


            formData.append(
                "image",
                file
            );



            const response =
                await uploadImage(formData);



            onChange(
                response.data.url
            );


        }
        finally {

            setUploading(false);

        }


    }




    function removeImage(){

        setPreview(null);

        onChange(null);

        if(inputRef.current){

            inputRef.current.value="";

        }

    }




    return (

        <div className="space-y-3">


            {
                preview ? (

                    <div className="
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                    ">


                       <img
                            src={
                                preview?.startsWith("blob:")
                                    ? preview
                                    : preview?.startsWith("http")
                                        ? preview
                                        : `${process.env.NEXT_PUBLIC_API_URL}${preview}`
                            }
                            className="
                                h-48
                                w-full
                                object-cover
                            "
                        />



                        <Button

                            type="button"

                            size="icon"

                            variant="destructive"

                            className="
                                absolute
                                right-2
                                top-2
                            "

                            onClick={removeImage}

                        >

                            <X className="h-4 w-4"/>

                        </Button>


                    </div>


                ) : (


                    <div

                        onClick={() =>
                            inputRef.current?.click()
                        }

                        className="
                            cursor-pointer
                            rounded-xl
                            border-2
                            border-dashed
                            p-8
                            text-center
                            hover:bg-muted
                            transition
                        "

                    >


                        {
                            uploading ? (

                                <Loader2
                                    className="
                                    mx-auto
                                    h-8
                                    w-8
                                    animate-spin
                                    "
                                />

                            ) : (

                                <ImagePlus
                                    className="
                                    mx-auto
                                    mb-3
                                    h-8
                                    w-8
                                    text-muted-foreground
                                    "
                                />

                            )

                        }


                        <p className="font-medium">

                            Upload Image

                        </p>


                        <p className="
                            text-sm
                            text-muted-foreground
                        ">

                            Click to select image

                        </p>


                    </div>


                )

            }



            {
                preview && (

                    <Button

                        type="button"

                        variant="outline"

                        className="w-full"

                        onClick={() =>
                            inputRef.current?.click()
                        }

                    >

                        Change Image

                    </Button>

                )
            }




            <input

                ref={inputRef}

                hidden

                type="file"

                accept="image/*"

                onChange={(e)=>{


                    const file =
                        e.target.files?.[0];


                    if(file){

                        upload(file);

                    }


                }}

            />


        </div>

    );

}