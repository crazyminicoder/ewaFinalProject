import { ACTIONS } from "./action";
import { v4 as uuid } from "uuid";
import { products as allProducts } from "./products";

// create two new case to increase & decrease the item count in redux
const initialState = {
  isLoggedIn: false,
  user: {
    id: "",
    userName: "",
    email: "",
    password: "",
  },
  cartItems: [],
  products: allProducts,
  address: {}
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case ACTIONS.SIGNUP:
      return {
        ...state,
        isLoggedIn: true,
        user: {
          id: uuid(),
          ...state.user,
          ...action.payload
        }
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: {},
        cartItems: []
      };
    case ACTIONS.ADD_TO_CART:
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.item_count++;
        return state;
      }
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload]
      };
    case ACTIONS.INCREASE_ITEM_COUNT:{
      const updatedState = state.cartItems.map((item) => {
        if (action.payload.id === item.id) {
          item.item_count++;
        }
        return item;
      });

     return {
       ...state,
       cartItems: updatedState
     }

    }
    
    case ACTIONS.DECREASE_ITEM_COUNT:{
      let updatedState = state.cartItems.map((item) => {
        if (action.payload.id === item.id ) {
            item.item_count--
        }
        return item;
      });

      updatedState = updatedState.filter(item => 
        item.item_count > 0
      )
     return {
       ...state,
       cartItems: updatedState
     }
    }
    
    case ACTIONS.SEARCH_PRODUCT:
      const {searchText = ''} = action.payload;
      const filteredProduct = allProducts.filter(({productName}) => productName.toLowerCase().includes(searchText.toLowerCase()))
      return {
        ...state,
        products: filteredProduct
      }
      case ACTIONS.ADD_ADDRESS:
        console.log("reducer", action.payload)
        return {
          ...state,
          address: action.payload
        }

     default:
      return state;
  }
  
};
