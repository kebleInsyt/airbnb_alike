import prisma from '@/app/libs/prismadb';

type IListingsParams = {

}

const getListings = async (params?: IListingsParams) => {

    let queryParams: any = {}

    try {

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