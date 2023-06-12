import prisma from '@/app/libs/prismadb';

export interface IListingsParams {
    userId?: string
    guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

const getListings = async (params: IListingsParams) => {
    try {
        const {userId, guestCount, roomCount, bathroomCount, startDate, endDate, locationValue, category } = params;

        let queryParams: any = {}

        if(userId) queryParams.userId = userId;
        if(category) queryParams.category = category;
        if(roomCount) queryParams.roomCount = { gte: +roomCount}
        if(bathroomCount) queryParams.bathroomCount = { gte: +bathroomCount}
        if(guestCount) queryParams.guestCount = { gte: +guestCount}
        if(locationValue) queryParams.locationValue = locationValue;
        if(startDate && endDate) {
            queryParams.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: {gte: startDate},
                                startDate: {lte: startDate}
                            },
                            {
                                startDate: {lte: endDate},
                                endDate: {gte: endDate}
                            }
                        ]
                    }
                }
            }
        }
        //retrieve listings from mongo db using prisma
        const listings = await prisma.listing.findMany({
            where: queryParams,
            orderBy: {
                createdAt: 'desc'
            }
        })

        const safeListings = listings.map(listing => ({
            ...listing,
            createdAt: listing.createdAt.toISOString()
        }));
        
        return safeListings;
    } catch(error: any) {
        throw new Error(error);
    }
}

export default getListings