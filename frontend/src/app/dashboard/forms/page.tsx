"use client";

import DynamicForm from '@/components/ui/dynamicForms'
import React from 'react'

const formsQuery = () => {
  return (
    <main>
      <h1 className='font-bold'>Knowledge Graph Forms Query</h1>
      <DynamicForm />
    </main>
  )
}

export default formsQuery