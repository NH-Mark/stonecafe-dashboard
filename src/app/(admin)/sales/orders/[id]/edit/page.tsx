import EditOrderPage from "@/features/orders/components/EditOrderPage"

interface Props {
    params: Promise<{
        id: string
    }>
}

export default async function Page({ params }: Props) {
    const { id } = await params

    return <EditOrderPage orderId={id} />
}