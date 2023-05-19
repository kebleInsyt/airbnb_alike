'use client'

import useRentModal from "@/app/hooks/useRentModal";
import axios from "axios";
import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import { categories } from "../navbar/Categories";
import Modal from "./Modal";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
    const rentModal = useRentModal();
    const router = useRouter();

    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading]= useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: '',
        } 
    });

    //watch for the following input fields
    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');
    
    

    // dynamicaly import MAP component
    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    //custom controlled input for react-hook-form
    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    //functions for various stages of the STEPS renting form
    const onBack = () => {
        setStep(value => value - 1);
    }
    const onNext = () => {
        setStep(value => value + 1);
    }

    // returns current page/ step
    const currentStepFn = () => {
        const values = Object.values(STEPS).filter((v) => !isNaN(Number(v))); 
        return Number(values[step]) + 1; 
    }

    const submitfn: SubmitHandler<FieldValues> = async (data)  => {
        if(step !== STEPS.PRICE) {
            return onNext();
        }

        try {
            setIsLoading(true);
            await axios.post('api/listings', data);
            toast.success('Listing created');
            router.refresh();
            reset();
            setStep(STEPS.CATEGORY);
            
        } catch(errors) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false);
            rentModal.onClose();
        }
    }

    const actionLabel = useMemo(() => {
        if(step === STEPS.PRICE) return 'Create';
        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if(step === STEPS.CATEGORY) return undefined;
        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading
                title="Which of these best describes your place?"
                subtitle="Pick a category"
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>
                {categories.map(item => (
                    <div key={item.label} className='col-span-1'>
                        <CategoryInput 
                            click={category => setCustomValue('category', category)}
                            label={item.label}
                            icon={item.icon}
                            selected={category === item.label}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    if(step === STEPS.LOCATION) {
        bodyContent = (
            <div className ='flex flex-col gap-8' >
                <Heading
                    title="Where is your place located?"
                    subtitle="Help guests find you!"
                />
                <CountrySelect 
                    value={location}
                    onChange={value => setCustomValue('location', value)}
                />
                <Map center={location?.latlng} />
            </div >
        )
    }

    if(step === STEPS.INFO) {
        bodyContent = (
            <div className ='flex flex-col gap-8' >
                <Heading
                    title="Share some information about your place"
                    subtitle="What amenities do you have"
                />
                <Counter  
                    title='Guests'
                    subtitle='How many guests do you allow?'
                    onchangefn={value => setCustomValue('guestCount', value)}
                    value={guestCount}
                />
                <Counter  
                    title='Rooms'
                    subtitle='How many rooms do you have?'
                    onchangefn={value => setCustomValue('roomCount', value)}
                    value={roomCount}
                />
                <Counter  
                    title='Bathrooms'
                    subtitle='How many bathrooms do you have?'
                    onchangefn={value => setCustomValue('bathroomCount', value)}
                    value={bathroomCount}
                />
            </div >
        )
    }

    if(step === STEPS.IMAGES) {
        bodyContent = (
            <div className ='flex flex-col gap-8' >
                <Heading
                    title="Add a photo of  your place"
                    subtitle="show guests what your place looks like"
                />
                <ImageUpload 
                    value={imageSrc}
                    onchangefn={value => setCustomValue('imageSrc', value)}
                />
            </div >
        )
    }

    if(step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className ='flex flex-col gap-8' >
                <Heading
                    title="How would you describe your place?"
                    subtitle="Short and sweet works best!"
                />
                <Input 
                    label='Title'
                    id='title'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr />
                <Input 
                    label='Description'
                    id='description'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div >
        )
    }

    if(step === STEPS.PRICE) {
        bodyContent = (
            <div className ='flex flex-col gap-8' >
                <Heading
                    title="Now, set your price"
                    subtitle="How much do you charge per night?"
                />
                <Input 
                    label='Price'
                    id='price'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                    formatPrice
                    type="number"
                />
               
            </div >
        )
    }

  return (
    <Modal  
        isOpen={rentModal.isOpen}
        title="Airbnb your home!"
        onSubmit={handleSubmit(submitfn)}
        onClose={rentModal.onClose}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        body={bodyContent}
        currentStepIndex={currentStepFn()}
        totalStep={Object.values(STEPS).length / 2}
    />
  )
}

export default RentModal