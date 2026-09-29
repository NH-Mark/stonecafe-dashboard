import ImportValidationPage from "@/features/import-orders/components/importValidationPage";

interface PageProps {
    params: Promise<{
        importId: string;
    }>;
}

export default async function Page({
    params,
}: PageProps) {
    const { importId } = await params;

    return (
        <ImportValidationPage
            importId={Number(importId)}
        />
    );
}