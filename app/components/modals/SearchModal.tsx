'use client'

import qs from 'query-string';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from "react";
import { Range } from 'react-date-range';
import { formatISO } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';

import useSearchModal from "@/app/hooks/useSearchModal";

import Modal from "./Modal";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import CountrySelect, { 
  CountrySelectValue
} from "../inputs/CountrySelect";
import Heading from '../Heading';

const SearchModal = () => {
    const searchModal = useSearchModal();

    return (
        <Modal 
             isOpen={searchModal.isOpen}
             onClose={searchModal.onClose}
             onSubmit={searchModal.onOpen}
             title='Filters'
             actionLabel='Search'       
        />
    )
}