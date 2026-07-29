import { create } from "zustand";
import { MenuItem } from "@/types/menu-item";
import { CartItem } from "../cart.types";


interface ModifierDialogStore {

    open:boolean;

    item:MenuItem|null;

    editItem:CartItem|null;


    openDialog:(item:MenuItem)=>void;

    openEditDialog:(cartItem:CartItem)=>void;


    closeDialog:()=>void;

}



export const useModifierDialog =
create<ModifierDialogStore>((set)=>({


    open:false,

    item:null,

    editItem:null,



    openDialog:(item)=>

        set({

            open:true,

            item,

            editItem:null

        }),



    openEditDialog:(cartItem)=>

        set({

            open:true,

            item:cartItem.menuItem,

            editItem:cartItem

        }),



    closeDialog:()=>


        set({

            open:false,

            item:null,

            editItem:null

        })


}));