'use client' 

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from 'react-icons/tb';

declare global {
    var cloudinary: any
}



type ImageUploadProps = {
    onchangefn(value: string): void,
    value: string
}

const uploadPreset = 'it3k9lu1';

const ImageUpload = ({onchangefn, value}: ImageUploadProps) => {

    const handleUpload = useCallback((result: any) => {
        onchangefn(result.info.secure_url)
    }, [onchangefn]);

  return (
    <CldUploadWidget
        onUpload={handleUpload}
        uploadPreset={uploadPreset}
        options={{
            maxFiles: 1
        }}
    >
        {({open}) => {
            return (
                <div onClick={() => open?.()}  className='relative cursor-pointer hover:opacity-70 transition border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600'>
                    <TbPhotoPlus size={50} />
                    <div className='font-semibold text-lg'> Click to upload</div>
                    {value && (
                        <div className="absolute inset-0 w-full h-full">
                            <Image 
                                fill
                                style={{ objectFit: 'cover'}}
                                src={value}
                                alt='upload'
                            />
                        </div>
                    )}
                </div>
            )
        }}
    </CldUploadWidget>
  )
}

export default ImageUpload