import React, { createContext, useEffect, useState } from "react";
import all_product from "../Components/Assets/all_product";


export const ShopContext = createContext(null);
const getDefaultCart = ()=>{
        let cart = {};
        for(let index = 0; index < all_product.length+1; index++) {
            cart[index] = 0;
        }
        return cart;
    }

const ShopContextProvider = (props) => {

    // const [cartItems,setCartItems] = useState(getDefaultCart());

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? 
        JSON.parse(savedCart) : getDefaultCart();
    });
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);
// The code from line 18 to 26 is taken from chatgpt. It is used to store the cart items in local storage so that the cart items are not lost when I refresh the page. The getDefaultCart function is used to initialize the cart items with 0 for all products. The useEffect hook is used to update the local storage whenever the cart items change.
// Orelse the actual code which is in line 16 is used as per video which I have made as a Comment.

    const addToCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        console.log(cartItems);
    }

    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
        {
            // if(cartItems[item]>0)
            // {
                let itemInfo = all_product.find((product)=> String(product.id)===String(item));
                if(itemInfo && cartItems[item]>0){
                totalAmount += itemInfo.new_price * cartItems[item];
            // }
        }
    }
            return totalAmount;
        // }
    };
    const getTotalCartItems = () =>{
        let totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem+= cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return(
        <ShopContext.Provider value={contextValue}>
             {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;