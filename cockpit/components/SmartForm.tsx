'use client';

import { useState } from 'react';

export default function SmartForm({ schema, onSubmit }: any) {

  const [values, setValues] = useState({});

  const change = (field:string,val:any)=>{

    setValues((v:any)=>({...v,[field]:val}));

  };

  return (

    <form

      onSubmit={(e)=>{e.preventDefault();onSubmit(values);}}

      className="flex flex-col gap-4 p-4"

    >

      {schema.map((col:any)=>(

        <div key={col.column_name} className="flex flex-col">

          <label className="text-sm opacity-75">{col.column_name}</label>

          {col.data_type.includes('timestamp') && (

            <input type="datetime-local"

              onChange={e=>change(col.column_name,e.target.value)}

              className="border p-2 rounded bg-neutral-100 dark:bg-neutral-900" />

          )}

          {col.data_type.includes('text') && (

            <input type="text"

              onChange={e=>change(col.column_name,e.target.value)}

              className="border p-2 rounded bg-neutral-100 dark:bg-neutral-900" />

          )}

          {col.data_type.includes('integer') && (

            <input type="number"

              onChange={e=>change(col.column_name,Number(e.target.value))}

              className="border p-2 rounded bg-neutral-100 dark:bg-neutral-900" />

          )}

          {col.data_type.includes('uuid') && (

            <input type="text"

              placeholder="UUID"

              onChange={e=>change(col.column_name,e.target.value)}

              className="border p-2 rounded bg-neutral-100 dark:bg-neutral-900" />

          )}

        </div>

      ))}

      <button className="px-4 py-2 rounded bg-black text-white">Submit</button>

    </form>

  );

}

