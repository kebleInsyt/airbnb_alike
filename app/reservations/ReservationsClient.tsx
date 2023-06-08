'use client'

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeReservation, SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";

type ReservationsClientProps = {
    reservations: SafeReservation[],
    currentUser: SafeUser | null
}
const ReservationsClient = ({reservations, currentUser}: ReservationsClientProps) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback(async (id: string) => {
        try{
           setDeletingId(id);
           await axios.delete(`api/reservations/${id}`);

           toast.success('Reservation Cancelled');
           router.refresh();
        }catch(error: any){
           toast.error(error?.response?.data?.error);
        }finally {
           setDeletingId('');
        }
    }, [router]);
    return (
        <Container>
           <Heading
                title='Reservations'
                subtitle='Bookings on your properties'
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
        </Container>
    )
}

export default ReservationsClient