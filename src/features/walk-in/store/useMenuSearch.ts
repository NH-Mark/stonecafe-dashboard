import { create } from "zustand";


type MenuSearchStore = {

    search: string;

    setSearch: (value: string) => void;

};


export const useMenuSearch =
    create<MenuSearchStore>((set) => ({

        search: "",

        setSearch: (value) =>
            set({
                search: value
            })

    }));