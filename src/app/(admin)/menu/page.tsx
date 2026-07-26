import MenuManagement from "@/features/menu/components/MenuManagement";





export default function MenuPage() {


    return (
        <div className="space-y-8">

            <div>
                <h2 className="text-xl font-semibold tracking-tight">
                    Menu Management
                </h2>

                <p className="text-sm text-muted-foreground">
                    Create, organize, and manage menu items, categories, modifiers, tags, and dietary symbols.
                </p>
            </div>

            <MenuManagement />

        </div>

    )

} 