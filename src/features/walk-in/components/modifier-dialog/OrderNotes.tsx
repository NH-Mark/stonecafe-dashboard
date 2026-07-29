import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


export function OrderNotes({

    value,

    onChange


}: any) {


    return (

        <div>


            <Label>

                Special Instructions

            </Label>


            <Textarea

                className="mt-2"

                value={value}

                onChange={
                    e => onChange(
                        e.target.value
                    )
                }

                placeholder="
No onion, extra spicy...
"

            />


        </div>

    )

}