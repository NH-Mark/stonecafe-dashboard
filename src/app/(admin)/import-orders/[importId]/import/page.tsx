import ImportExecutePage from "@/features/import-orders/components/ImportExecutePage";

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
        <ImportExecutePage
            importId={Number(importId)}
        />
    );
}