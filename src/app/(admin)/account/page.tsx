"use client";

import AccountManagement from "@/features/account/AccountManagement";

export default function AccountPage() {

    return (
       <div className="space-y-8">
       
                   <div>
                       <h2 className="text-xl font-semibold tracking-tight">
                           Account Settings
                       </h2>
       
                       <p className="text-sm text-muted-foreground">
                           Create, organize, and manage menu items, categories, modifiers, tags, and dietary symbols.
                       </p>
                   </div>
       
                   <AccountManagement />
       
               </div> 
    );
}