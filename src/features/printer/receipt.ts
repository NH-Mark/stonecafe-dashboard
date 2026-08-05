import qz from "qz-tray";


const PRINTER_NAME = "EPSON TM-T20III Receipt";


const WIDTH = 48;


function center(text: string) {

    const spaces = Math.max(
        Math.floor((WIDTH - text.length) / 2),
        0
    );

    return " ".repeat(spaces) + text;

}



function row(left: string, right: string) {

    const spaces = Math.max(
        WIDTH - left.length - right.length,
        1
    );

    return left + " ".repeat(spaces) + right;

}




export async function printReceipt(order:any) {


    if(!qz.websocket.isActive()) {

        await qz.websocket.connect();

    }



    const config =
        qz.configs.create(
            PRINTER_NAME
        );



    let receipt = "";



    // HEADER CENTER
    receipt += center("STONE CAFE") + "\n";
    receipt += center("Stone Speciality Coffee") + "\n";
    receipt += center("Doha, Qatar") + "\n";
    receipt += center("Tel: +974 XXXX XXXX") + "\n";


    receipt += "------------------------------------------------\n";


    // ORDER INFO LEFT

    receipt += `Order No : ${order.order_no}\n`;
    receipt += `Date     : ${order.ordered_at ?? new Date().toLocaleString()}\n`;
    receipt += `Cashier  : ${order.cashier ?? "-"}\n`;
    receipt += `Type     : ${order.type ?? "-"}\n`;


    if(order.table){
        receipt += `Table    : ${order.table}\n`;
    }


    receipt += "------------------------------------------------\n";

    receipt += row(
        "ITEM",
        "AMOUNT"
    ) + "\n";


   receipt += "------------------------------------------------\n";



    order.items.forEach((item:any)=>{


        receipt += item.menu_item + "\n";


        receipt += row(

            `${item.quantity} x ${Number(item.unit_price).toFixed(2)}`,

            Number(item.total_price).toFixed(2)

        ) + "\n";



        if(item.modifiers?.length){


            item.modifiers.forEach((modifier:any)=>{


                receipt +=
                `  + ${modifier.modifier} ${Number(modifier.price).toFixed(2)}\n`;


            });


        }



        if(item.notes){

            receipt +=
            `  Note: ${item.notes}\n`;

        }


        receipt += "\n";


    });



    receipt += "------------------------------------------------\n";


    receipt += row(
        "Subtotal",
        Number(order.subtotal).toFixed(2)
    ) + "\n";


    receipt += row(
        "Discount",
        Number(order.discount_amount).toFixed(2)
    ) + "\n";


    receipt += "------------------------------------------------\n";

    receipt += row(
        "TOTAL",
        Number(order.total).toFixed(2)+" QAR"
    ) + "\n";


    receipt += "------------------------------------------------\n";


    receipt +=
    `Payment : ${order.payments?.[0]?.method ?? "-"}\n`;



    if(order.notes){

        receipt += "\nOrder Note\n";
        receipt += order.notes + "\n";

    }



    receipt += "------------------------------------------------\n";


    receipt += center("THANK YOU!") + "\n";
    receipt += center("Please Visit Again") + "\n";
    receipt += center("www.stonecafe.qa") + "\n";

    receipt += "\n\n\n\n";

    // cut
    receipt += "\x1D\x56\x01";



    await qz.print(

        config,

        [
            {
                type:"raw",
                format:"plain",
                data:receipt
            }
        ]

    );


}