"use client";

import DynamicForm from '@/components/ui/dynamicForms'
import React from 'react'

const formsQuery = () => {
  return (
    <main>
      <div className='font-bold text-4xl flex justify-center items-center py-2'>
          Knowledge Graph Forms Query
      </div>
      <DynamicForm />
    </main>
  )
}

export default formsQuery