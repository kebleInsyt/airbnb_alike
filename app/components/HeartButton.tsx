'use client'

import { SafeUser } from '@/app/types'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import useFavorite from '../hooks/useFavorite'

type HeartButtonProps = {
    listingId: string
    currentUser?: SafeUser | null
}
export default function HeartButton({ listingId, currentUser }: HeartButtonProps) {
  const { hasFavorited, toggleFavorite } = useFavorite({listingId, currentUser});

    return (
        <div className='relative hover:opacity-80 transition cursor-pointer' onClick={toggleFavorite}>
            <AiOutlineHeart 
                size={28}
                className='absolute -top-[2px] -right-[2px] fill-white'            
            />
            <AiFillHeart 
                size={24}
                className={hasFavorited ? 'fill-lime-600' : 'fill-neutral-500/70'}
            />
        </div>
    )
}