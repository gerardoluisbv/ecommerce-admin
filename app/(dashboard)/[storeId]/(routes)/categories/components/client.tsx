'use client'

import { Plus } from "lucide-react"
import { useParams, useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@radix-ui/react-separator"
import { CategoryColumns, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface CategoryClientProps {
    data: CategoryColumns[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Categories (${data?.length})`}
                    description="Manage categories for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                        Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Separator />
            <Heading title="API" description="API calls for Categories"/>
            <ApiList entityName="categories" entityIdName="categoryId" />
        </>
    )
}