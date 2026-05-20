// import React, { createContext, useEffect, useState } from "react";



// export const ShopContext = createContext(null);
// const getDefaultCart = ()=>{
//         let cart = {};
//         for(let index = 0; index < 300+1; index++) {
//             cart[index] = 0;
//         }
//         return cart;
//     }

// const ShopContextProvider = (props) => {

//     const [all_product,setAll_Product] = useState([]);
//     const cartLoadedRef = React.useRef(false);

//     const [cartItems, setCartItems] = useState(() => {
//     const savedCart = localStorage.getItem("cartItems");
//     return savedCart ? JSON.parse(savedCart) : getDefaultCart();
// });

// console.log("CART LOADED:", cartItems);

//     useEffect(() => {

//     fetch('http://localhost:4000/allproducts')
//         .then((response) => response.json())
//         .then((data) => setAll_Product(data));

//     const token = localStorage.getItem('auth-token');

//     if (!token || cartLoadedRef.current) return;

//     cartLoadedRef.current = true;

//     fetch('http://localhost:4000/getcart', {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'auth-token': String(token),
//             'Content-Type': 'application/json',
//         },
//         body: "",
//     })
//     .then((res) => res.json())
//     .then((data) => {
//         console.log("BACKEND DATA:", data);

//         if (data && typeof data === "object") {

//             setCartItems((prev) => {
//                 const merged = { ...prev, ...data };
//                 localStorage.setItem("cartItems", JSON.stringify(merged));
//                 return merged;
//             });

//         }
//     })
//     .catch(() => {});

// }, []);

//     const addToCart = (itemId) => {
//     setCartItems((prev) => ({
//         ...prev,
//         [itemId]: (prev[itemId] || 0) + 1
//     }));

//     const token = localStorage.getItem('auth-token');

//     if (token) {
//         fetch('http://localhost:4000/addtocart', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'auth-token': String(token),
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ itemId: itemId }),
//         })
//         .then((response) => response.json())
//         .then((data) => console.log(data));
//     }
// };

//     const removeFromCart = (itemId) => {
//     setCartItems((prev) => ({
//         ...prev,
//         [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
//     }));

//     if (localStorage.getItem('auth-token')) {
//         fetch('http://localhost:4000/removefromcart', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'auth-token': String(localStorage.getItem('auth-token')),
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ itemId: itemId }),
//         })
//         .then((response) => response.json())
//         .then((data) => console.log(data));
//     }
// };

//     const getTotalCartAmount = () => {
//         let totalAmount = 0;
//         for(const item in cartItems)
//         {
            
//                 let itemInfo = all_product.find((product)=> String(product.id)===String(item));
//                 if(itemInfo && cartItems[item]>0){
//                 totalAmount += itemInfo.new_price * cartItems[item];
//         }
//     }
//             return totalAmount;
//     };

//     useEffect(() => {
//         localStorage.setItem("cartItems", JSON.stringify(cartItems));
//     }, [cartItems]);

//     const getTotalCartItems = () =>{
//         let totalItem = 0;
//         for(const item in cartItems)
//         {
//             if(cartItems[item]>0)
//             {
//                 totalItem+= cartItems[item];
//             }
//         }
//         return totalItem;
//     }

//     const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
//     return(
//         <ShopContext.Provider value={contextValue}>
//              {props.children}
//         </ShopContext.Provider>
//     )
// }

// export default ShopContextProvider;

import React, { createContext, useEffect, useState, useRef } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 301; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {

    const [all_product, setAll_Product] = useState([]);

    const cartLoadedRef = useRef(false); // ✅ FIX 1 (important)

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : getDefaultCart();
    });

    console.log("CART LOADED:", cartItems);

    // ---------------- FETCH PRODUCTS + CART ----------------
    useEffect(() => {

        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data));

        const token = localStorage.getItem('auth-token');

        // ✅ FIX 2: prevent multiple calls
        if (!token || cartLoadedRef.current) return;

        cartLoadedRef.current = true;

        fetch('http://localhost:4000/getcart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'auth-token': String(token),
                'Content-Type': 'application/json',
            },
            body: "",
        })
        .then((res) => res.json())
        .then((data) => {

            console.log("BACKEND DATA:", data);

            if (data && typeof data === "object") {

                // ✅ FIX 3: safe merge
                setCartItems((prev) => {
                    const merged = { ...getDefaultCart(), ...prev, ...data };
                    localStorage.setItem("cartItems", JSON.stringify(merged));
                    return merged;
                });

            }
        })
        .catch(() => {});

    }, []);

    // ---------------- ADD TO CART ----------------
    const addToCart = (itemId) => {
        setCartItems((prev) => {
            const updated = {
                ...prev,
                [itemId]: (prev[itemId] || 0) + 1
            };
            localStorage.setItem("cartItems", JSON.stringify(updated));
            return updated;
        });

        const token = localStorage.getItem('auth-token');

        if (token) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': String(token),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }
    };

    // ---------------- REMOVE FROM CART ----------------
    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updated = {
                ...prev,
                [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
            };
            localStorage.setItem("cartItems", JSON.stringify(updated));
            return updated;
        });

        const token = localStorage.getItem('auth-token');

        if (token) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': String(token),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }
    };

    // ---------------- TOTAL AMOUNT ----------------
    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            let itemInfo = all_product.find(
                (product) => String(product.id) === String(item)
            );

            if (itemInfo && cartItems[item] > 0) {
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }

        return totalAmount;
    };

    // ---------------- TOTAL ITEMS ----------------
    const getTotalCartItems = () => {
        let totalItem = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }

        return totalItem;
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;