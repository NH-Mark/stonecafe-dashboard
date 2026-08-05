"use client";

import { useEffect, useState } from "react";
import { Order } from "../orders.types";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
    createPayment
} from "../orders.service";
import { getPaymentMethods } from "@/features/payment-method/payment-method.service";


interface PaymentMethod {
    id: number;
    name: string;
}


interface Props {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => Promise<void>;
}


export default function ReceivePaymentDialog({
    order,
    open,
    onOpenChange,
    onSuccess,
}: Props) {

    const [amount, setAmount] = useState("");

    const [paymentMethod, setPaymentMethod] =
        useState<string>("");

    const [reference, setReference] =
        useState("");

    const [methods, setMethods] =
        useState<PaymentMethod[]>([]);


    const [loadingMethods, setLoadingMethods] =
        useState(false);

    const [loading, setLoading] =
        useState(false);



    const paidAmount =
        order.payments?.reduce(
            (sum, payment) =>
                sum + Number(payment.amount),
            0
        ) ?? 0;


    const remaining =
        Number(order.total) - paidAmount;



    async function loadPaymentMethods() {

        try {

            setLoadingMethods(true);

            const response =
                await getPaymentMethods();


            setMethods(
                response.data.data ?? response.data
            );


        } catch (error) {

            toast.error(
                "Failed to load payment methods"
            );

        } finally {

            setLoadingMethods(false);

        }
    }



    useEffect(() => {

        if (open) {

            setAmount("");
            setReference("");
            setPaymentMethod("");

            loadPaymentMethods();
        }

    }, [open]);




    async function handleSubmit() {


        const paymentAmount =
            Number(amount);



        if (!paymentMethod) {

            toast.error(
                "Please select payment method"
            );

            return;
        }



        if (!paymentAmount || paymentAmount <= 0) {

            toast.error(
                "Enter valid amount"
            );

            return;
        }



        if (paymentAmount > remaining) {

            toast.error(
                "Amount cannot be greater than remaining balance"
            );

            return;
        }



        try {

            setLoading(true);


            await createPayment(
                order.id,
                {
                    amount: paymentAmount,
                    payment_method_id:
                        Number(paymentMethod),
                    reference,
                }
            );


            toast.success(
                "Payment received successfully"
            );


            await onSuccess?.();


            onOpenChange(false);


        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to receive payment"
            );


        } finally {

            setLoading(false);

        }
    }



    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-[450px]">


                <DialogHeader>

                    <DialogTitle>
                        Receive Payment
                    </DialogTitle>


                    <DialogDescription>
                        Record payment for{" "}
                        <strong>
                            {order.order_no}
                        </strong>
                    </DialogDescription>

                </DialogHeader>




                <div className="space-y-5 py-4">



                    {/* Order Summary */}

                    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">


                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                                Total
                            </span>

                            <strong>
                                QAR {Number(order.total).toFixed(2)}
                            </strong>

                        </div>



                        <div className="flex justify-between">

                            <span className="text-sm text-muted-foreground">
                                Paid
                            </span>

                            <strong>
                                QAR {paidAmount.toFixed(2)}
                            </strong>

                        </div>



                        <div className="flex justify-between border-t pt-2">

                            <span className="font-medium">
                                Remaining
                            </span>

                            <strong className="text-red-600">
                                QAR {remaining.toFixed(2)}
                            </strong>

                        </div>


                    </div>





                    {/* Payment Method */}

                    <div className="space-y-2">


                        <label className="text-sm font-medium">
                            Payment Method
                        </label>


                        <select
                            className="w-full border rounded-md p-2"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="">
                                Select Method
                            </option>

                            {methods.map((method) => (
                                <option
                                    key={method.id}
                                    value={method.id}
                                >
                                    {method.name}
                                </option>
                            ))}
                        </select>
                       

                    </div>





                    {/* Amount */}

                    <div className="space-y-2">


                        <label className="text-sm font-medium">
                            Amount Received
                        </label>


                        <Input

                            type="number"

                            value={amount}

                            onChange={(e) =>
                                setAmount(e.target.value)
                            }

                            placeholder="0.00"

                        />


                    </div>





                    {/* Reference */}

                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            Reference
                        </label>


                        <Input

                            value={reference}

                            onChange={(e) =>
                                setReference(e.target.value)
                            }

                            placeholder="Card reference / note"

                        />

                    </div>



                </div>





                <DialogFooter>


                    <Button

                        variant="outline"

                        disabled={loading}

                        onClick={() =>
                            onOpenChange(false)
                        }

                    >
                        Cancel
                    </Button>



                    <Button

                        disabled={loading}

                        onClick={handleSubmit}

                    >

                        {loading
                            ? "Saving..."
                            : "Receive Payment"}

                    </Button>


                </DialogFooter>



            </DialogContent>


        </Dialog>

    );
}