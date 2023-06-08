import prisma from '@/app/libs/prismadb';

export interface IListingsParams {
    userId?: string
}

const getListings = async (params: IListingsParams) => {
    try {
        let queryParams: any = {}
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