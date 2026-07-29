export function OrderSummary({
    total
}: {
    total: number
}) {


    return (

        <div
            className="
text-xl
font-bold
"
        >

            Total:
            {" "}
            {total.toFixed(2)}
            {" "}QAR

        </div>


    )

}