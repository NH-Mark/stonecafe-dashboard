import { formatDistanceToNow } from "date-fns";

interface Props{
    orderedAt:string;
}

export function OrderTimer({
    orderedAt,
}:Props){

    return(

        <p className="text-xs text-muted-foreground">

            {formatDistanceToNow(
                new Date(orderedAt),
                {
                    addSuffix:true,
                }
            )}

        </p>

    );
}