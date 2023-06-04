'use client'

import Container from "@/app/components/Container"
import ListingHead from "@/app/components/listings/ListingHead"
import ListingInfo from "@/app/components/listings/ListingInfo"
import ListingReservation from "@/app/components/listings/ListingReservation"
import { categories } from "@/app/components/navbar/Categories"

import { SafeListing, SafeUser, SafeReservation } from "@/app/types"
import useLoginModal from "@/app/hooks/useLoginModal";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from "next/navigation"
import { differenceInDays, eachDayOfInterval } from 'date-fns';
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";
import axios from "axios"

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

interface ListingClientProps {
    listing: SafeListing & {
        user: SafeUser
    },
    currentUser?: SafeUser | null,
    reservations?: SafeReservation[]
}

export default function ListingClient({ 
    listing,
    currentUser,
    reservations = []
}: ListingClientProps ) {
    const loginModal = useLoginModal();
    const router = useRouter();
 
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    //fn that returns disables previously selected date ranges
    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation: any) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            });

            dates = [...dates, ...range]
        });
        
        return dates
    }, [reservations]);

    //fn for booking reservation
    const onCreateReservation = useCallback(async () => {
        if(!currentUser) return loginModal.onOpen();

        try {
            setIsLoading(true);
            await axios.post('/api/reservations', {
                totalPrice,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                listingId: listing?.id
            });
            toast.success('Booking is reserved');
            setDateRange(initialDateRange);
            router.refresh();
        } catch(error) {
            toast.error('Booking was not successful');
        }finally {
            setIsLoading(false);
        }
    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

    //calculates the total listing price 
    useEffect(() => {
        if(dateRange.startDate && dateRange.endDate) {
            const numOfDays = differenceInDays(dateRange.endDate, dateRange.startDate);

            if(numOfDays && listing.price) {
                setTotalPrice((numOfDays + 1) * listing.price);
            } else {
                setTotalPrice(listing.price)
            }
        }
    }, [dateRange, listing.price])

    //memoize the output of the function
    const category = useMemo(() => {
        return categories.find(item => item.label === listing.category);
    }, [listing.category]);
    
    return (
        <Container>
            <div className='flex flex-col gap-6'>
                <ListingHead
                    title={listing.title}
                    imageSrc={listing.imageSrc}
                    locationValue={listing.locationValue}
                    id={listing.id}
                    currentUser={currentUser}
                />
                <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
                    <ListingInfo 
                        user={listing.user}
                        description={listing.description}
                        guestCount={listing.guestCount}
                        category={category}
                        roomCount={listing.roomCount}
                        bathroomCount={listing.bathroomCount}
                        locationValue={listing.locationValue}
                    />
                    <div className='order-first mb-10 md:order-last md:col-span-3'>
                    <ListingReservation 
                        price={listing.price}
                        totalPrice={totalPrice}
                        onChangeDate={(value) => setDateRange(value)}
                        dateRange={dateRange}
                        onSubmit={onCreateReservation}
                        disabled={isLoading}
                        disabledDates={disabledDates}
                    />
                    </div>
                </div>
            </div>
        </Container>
        
    )

}