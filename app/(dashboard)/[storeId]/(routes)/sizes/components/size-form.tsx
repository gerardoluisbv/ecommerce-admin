'use client'

import { z } from "zod"
import axios from "axios";
import { useState } from 'react';
import { Size } from "@prisma/client"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast";
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})


type SizeFormValues = z.infer<typeof formSchema>


interface SizeFormProps {
    initialData: Size | null
}


const SizeForm: React.FC<SizeFormProps> = ({
    initialData
}) => {


  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit sizes" : "Create sizes";
  const description = initialData ? "Edit sizes" : "Add a new sizes";
  const toastMessage = initialData ? "Size updated." : "Size Created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeFormValues> ({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  })
  
  const onSubmit = async (data: SizeFormValues) => {
    console.log(data);
    try {
      setLoading(true)
      if(initialData){
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      toast.success(toastMessage);
      // toast.success("Store updated");
      router.refresh();
      router.push(`/${params.storeId}/sizes`)

    } catch(error) {
      toast.error("Something went wrong.");
    } finally{
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try{

      setLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      toast.success("size deleted");
      router.push(`/${params.storeId}/sizes`);
      router.refresh();

    } catch(error){
      toast.error("Make sure you removed all products using this size first.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open}
      onClose={()=> setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
      
    />
      <div className="flex items-center justify-between">
          <Heading 
              title={ title }
              description= { description }
          />
          {initialData && (
            <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={()=> setOpen(true)}
            >
            <Trash className="h-4 w-4"/>
          </Button>
          )
          }
      </div>
      <Separator />
      <Form  {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="name"
              render={( { field } ) =>(
                <FormItem>
                  <FormLabel> Name </FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Size name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="value"
              render={( { field } ) =>(
                <FormItem>
                  <FormLabel> Value </FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Size value" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            { action }
          </Button>
        </form>
      </Form>
    </>
  )
}

export default SizeForm