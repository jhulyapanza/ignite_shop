import Image from "next/future/image"
import {CartButton} from "../CartButton";
import * as Dialog from "@radix-ui/react-dialog";
import {CartClose, CartContent, CartProduct, CartProductDetails, CartProductImage, CartFinalization, FinalizationDetails} from "./styles";
import {X} from "phosphor-react";
import {useCart} from "../../hooks/useCart";
import {useState} from "react";
import axios from "axios";

export function Cart(){

    const {cartItems, removeCartItem, cartTotal} = useCart();
    const cartQuantity = cartItems.length;
    const formattedCartTotal = new Intl.NumberFormat("pt-BR",{
        style: 'currency',
        currency: 'BRL'
        }).format(cartTotal);

    const [isCreatingCheckoutSession, setCreatingCheckoutSession] = useState(false);

    async function handleCheckout(){
        try {
            setCreatingCheckoutSession(true);
            const response = await axios.post('/api/checkout', {
                products: cartItems,
            });

            const {checkoutUrl} = response.data;

            window.location.href = checkoutUrl;
        }catch (err){
            setCreatingCheckoutSession(false);
            alert("Falha ao redirecionar para checkout!");
        }
    }

    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <CartButton color="gray"/>
            </Dialog.Trigger>
            <Dialog.Portal>
                <CartContent>
                    <CartClose>
                        <X size={24} weight="bold"/>
                    </CartClose>

                    <h2>Sacola de compras</h2>
                    <section>
                        {cartQuantity <= 0 && (
                            <p>Parece que seu carrinho está vazio :(</p>
                        )}

                        {cartItems.map((cartItem) => (
                            <CartProduct key={cartItem.id}>
                                <CartProductImage>
                                    <Image
                                        width={100}
                                        height={93}
                                        src={cartItem.imageUrl}
                                    />
                                </CartProductImage>
                                <CartProductDetails>
                                    <p>{cartItem.name}</p>
                                    <strong>{cartItem.price}</strong>
                                    <button onClick={() => removeCartItem(cartItem.id)}>Remover</button>
                                </CartProductDetails>
                            </CartProduct>
                        ))}
                    </section>
                    <CartFinalization>
                        <FinalizationDetails>
                            <div>
                                <span>Quantidade</span>
                                <p>{cartQuantity} {cartQuantity === 1 ? 'item' : 'itens'}</p>
                            </div>
                            <div>
                                <span>Valor Total</span>
                                <p>{formattedCartTotal}</p>
                            </div>
                        </FinalizationDetails>
                        <button
                        onClick={handleCheckout}
                        disabled={isCreatingCheckoutSession || cartQuantity <= 0}
                        >Finalizar compra</button>
                    </CartFinalization>
                </CartContent>
            </Dialog.Portal>
        </Dialog.Root>
    )
}