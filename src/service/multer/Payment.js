
import Stripe from 'stripe';

export async function payment ({
    payment_method_types=["card"],
    mode="payment",
    customer_email,
    metadata,
    success_url,
    cancel_url, 
    line_items=[],
    discounts=[],

}={}){
    const stripe = new Stripe('sk_test_51QXoXfRppahSIc06xgY5kUiDTctbAsZFKszFzO7Dzry9vMdYOcteDEMxuQNwpaLYHpbyVOlGpt51oW5HOtJXDpRr00qlUrsc7k');
    const session  = await stripe.checkout.sessions.create({
            payment_method_types,
            mode,
            customer_email,
            metadata,
            success_url,
            cancel_url, 
            line_items,
            discounts,

    })
    return session
}

/*
{
                        price_data:{
                            currency: "USD",
                            product_data:{
                                name:product.title
                            },
                            unit_amount:product.sebScripne * 100
                        },
                        quantity:1
                }
*/