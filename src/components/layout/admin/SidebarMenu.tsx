"use client";


import SidebarItem from "./SidebarItem";
import SidebarGroup from "./SidebarGroup";


export default function SidebarMenu({
    items
}: {
    items: any[]
}) {


    return (

        <div className="space-y-1">


            {
                items.map((item) => {


                    if (item.children) {

                        return (

                            <SidebarGroup

                                key={item.title}

                                title={item.title}

                                icon={item.icon}

                                children={item.children}

                            />

                        )

                    }



                    return (

                        <SidebarItem

                            key={item.href}

                            href={item.href}

                            title={item.title}

                            icon={item.icon}

                        />

                    )


                })

            }


        </div>

    );


}