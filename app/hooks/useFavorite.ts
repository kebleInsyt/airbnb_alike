import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";

import useLoginModal from "./useLoginModal";

type IUseFavorite = {
  listingId: string,
  currentUser?: SafeUser | null
}
const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  //return true or false based on whether the favorite list includes the current listing Id
  const hasFavorited = useMemo(() => {
    const list = currentUser?.favourite || [];
    return list.includes(listingId);
  }, [listingId, currentUser]);

  const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if(!currentUser) return loginModal.onOpen();

    try{
      let request;
      if(hasFavorited) {
        await axios.delete(`/api/favorites/${listingId}`);
        toast.success('Removved from Favourites')
      } else {
        await axios.post(`/api/favorites/${listingId}`);
        toast.success('Added to Favourites')
      }
      
      router.refresh();
    } catch(err) {
      toast.error('Something went wrong');
    }
  }, [hasFavorited, currentUser, loginModal, listingId, router]);

  return {
    hasFavorited,
    toggleFavorite
  }
}

export default useFavorite