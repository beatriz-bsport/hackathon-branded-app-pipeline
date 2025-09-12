import { z } from 'zod';
import { productTypeValues } from '../constants';

export const addToCartEventSchema = z
  .object({
    eventType: z.string().default('add_to_cart'),
    product_type: z
      .enum(productTypeValues)
      .describe('The type of product being added to the cart'),
    product_name: z
      .string()
      .describe('The name of the product being added to the cart'),
    cart_value: z
      .number()
      .describe('The total value of the cart after adding the product'),
    product_price: z
      .number()
      .describe('The price of the product being added to the cart'),
  })
  .describe('When the user adds a product to their cart');

export const cartViewedEventSchema = z
  .object({
    eventType: z.string().default('cart_viewed'),
    cart_value: z
      .number()
      .describe('The total value of the cart when the user views it'),
    product_quantity: z
      .number()
      .describe('The number of items in the cart when the user views it'),
  })
  .describe('When the user views their cart');

export const purchaseConfirmationEventSchema = z
  .object({
    eventType: z.string().default('purchase_confirmation'),
    cart_value: z
      .number()
      .describe('The total value of the cart at the time of purchase'),
    product_quantity: z
      .number()
      .describe('The number of items in the cart at the time of purchase'),
  })
  .describe('When the user completes a purchase');

export const purchaseItemEventSchema = z
  .object({
    eventType: z.string().default('purchase_item'),
    product_name: z
      .string()
      .describe('The name of the product being purchased'),
    product_type: z
      .enum(productTypeValues)
      .describe('The type of product being purchased'),
    product_price: z
      .number()
      .describe('The price of the product being purchased'),
    product_quantity: z
      .number()
      .describe('The quantity of the product being purchased'),
  })
  .describe(
    'When the user purchases an item. One event for each item in the cart',
  );
