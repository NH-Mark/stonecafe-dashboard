"use client";

import { useState } from "react";

export interface ServerPaginationState {
page: number;
perPage: number;
}

export function useServerPagination(
initialPage = 1,
initialPerPage = 10
) {
const [pagination, setPagination] =
useState<ServerPaginationState>({
page: initialPage,
perPage: initialPerPage,
});

function goToPage(page: number) {
    setPagination((prev) => ({
        ...prev,
        page,
    }));
}

function changePageSize(perPage: number) {
    setPagination({
        page: 1,
        perPage,
    });
}

function resetPage() {
    setPagination((prev) => ({
        ...prev,
        page: 1,
    }));
}

return {
    pagination,
    goToPage,
    changePageSize,
    resetPage,
};

}
