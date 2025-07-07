import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../UserAndAuthServices/LocalStorageService';




function getCookie(name) {
  const cookieArr = document.cookie.split(";").map(c => c.trim());
  for (let cookie of cookieArr) {
      if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.split("=")[1]);
      }
  }
  return null;
 }
const deviceCookie = getCookie('device');



const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_API_URL}dbd/api/`,
  credentials: 'include',  // Ensures cookies are sent with requests
  prepareHeaders: (headers) => {
    const { access_token } = getToken();
    // const deviceCookie = getCookie('device');  // Get device cookie

    if (access_token) {
      headers.set('authorization', `Bearer ${access_token}`);
    }
    if (deviceCookie) {
      headers.set('device', deviceCookie);  // Set Device-ID header
    }
    
    return headers;
  },
});

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery,
  endpoints: (builder) => ({
    fetchCartItems: builder.query({
      query: () => 'cartitems/cartlist/',
    }),
    addItemToCart: builder.mutation({
      query: (item) => ({
        url: 'cartitems/add_item/',
        method: 'POST',
        body: item,
      }),
    }),
    updateCartItem: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `cartitems/update_item/${id}/`,
        method: 'PATCH',
        body: { quantity },
      }),
    }),
    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `cartitems/cartitem_delete/${id}/`,
        method: 'DELETE',
      }),
    }),
    deleteAllCartItems: builder.mutation({
      query: () => ({
        url: 'cartitems/allcart_delete/',
        method: 'DELETE',
      }),
    }),
    addCoupon: builder.mutation({
      query: (couponCode) => ({
        url: 'cartitems/add_coupon/',
        method: 'POST',
        body: { coupon: couponCode },
      }),
    }),
  }),
});

export const {
  useFetchCartItemsQuery,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useDeleteAllCartItemsMutation,
  useAddCouponMutation,
} = cartApi;
