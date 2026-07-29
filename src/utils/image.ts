// utils/image.ts

export function imageUrl(path?: string | null)
{
    if (!path) {
        return "/images/no-image.png";
    }

    if (path.startsWith("http")) {
        return path;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}