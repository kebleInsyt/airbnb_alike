'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'

type CounterProps = {
    title: string,
    subtitle: string,
    onchangefn(value: number) : void,
    value: number
}

const Counter = ({ title, subtitle, onchangefn, value}: CounterProps) => {

    //funtions for the counter
   const increment = useCallback(() => {
        onchangefn(value + 1);
    }, [onchangefn, value]);

   const decrement = useCallback(() => {
        if(value === 1) {
            toast.error('You cannot go below 1')
            return;  
        }

        onchangefn(value - 1);
    }, [onchangefn, value]);

  return (
    <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col'>
            <div className="font-medium">{title}</div>
            <div className="font-light text-gray-600">{subtitle}</div>
        </div>
        <div className='flex flex-row items-center gap-4'>
            <div onClick={decrement} className='w-10 h-10 rounded-full border-[1px] flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition'><AiOutlineMinus /></div>
            <div className='font-light text-xl text-neutral-600'>{value}</div>
            <div onClick={increment} className='w-10 h-10 rounded-full border-[1px] flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition'><AiOutlinePlus /></div>
        </div>
    </div>
  )
}

export default Counter