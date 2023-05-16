'use client'

import { IconType } from "react-icons"

interface CategoryInputProps {
    label: string,
    icon: IconType,
    selected?: boolean
    click(val: string): void
}
const CategoryInput = ({label, icon: Icon, selected, click}: CategoryInputProps) => {

  return (
    <div onClick={() => click(label)} className={`flex flex-row items-center rounded-xl border-2 p-4 gap-3 hover:border-black transition cursor-pointer ${selected ? 'border-black' : 'border-neutral-200'}`}>
      <Icon size={30} />
      <div className='font-semibold'>{label}</div>
    </div>
  )
}

export default CategoryInput