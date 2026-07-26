import ModifierManagement from "@/features/modifiers/components/ModifierManagement";


export default function ModifierPage() {
    return (
        <div className="space-y-8">

            <div>
                 <h2 className="text-lg font-semibold">
                    Modifiers
                </h2>

                <p className="text-sm text-muted-foreground">
                    Manage modifier groups and modifiers.
                </p>
            </div>

            <ModifierManagement />

        </div>
    );
}