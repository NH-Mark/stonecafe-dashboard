import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Modifier } from "@/types/modifier";


interface Props {

    modifier: Modifier;

    type: "single" | "multiple";

    checked?: boolean;

    onChange?: () => void;

}


export function ModifierOption({

    modifier,

    type,

    checked = false,

    onChange

}: Props) {


    return (

        <div
            className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                bg-white
                p-3
            "
        >


            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >


                {
                    type === "single"

                    ?

                    <RadioGroupItem
                        value={
                            modifier.id.toString()
                        }
                    />

                    :

                    <Checkbox

                        checked={checked}

                        onCheckedChange={() =>
                            onChange?.()
                        }

                    />

                }



                <Label>

                    {modifier.name}

                </Label>


            </div>



            <span className="font-medium">

                +
                {Number(modifier.price).toFixed(2)}
                {" "}QAR

            </span>


        </div>

    );

}