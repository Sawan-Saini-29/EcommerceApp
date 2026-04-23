import React from 'react';
import renderer, { act } from 'react-test-renderer';
import CartScreen from '../src/screens/CartScreen';
import { CartContext } from '../src/context/CartContext';
import { Alert, TouchableOpacity } from 'react-native';

jest.spyOn(Alert, 'alert');

describe('CartScreen', () => {
    const cartItem: any = {
        product: {
            id: 1,
            title: 'Test Product',
            price: 12.5,
            thumbnail: 'https://example.com/image.png',
        },
        quantity: 2,
    };

    it('renders empty cart message when no items exist', () => {
        let tree: renderer.ReactTestRenderer | any;

        act(() => {
            tree = renderer.create(
                <CartContext.Provider
                    value={{
                        cart: [],
                        addToCart: jest.fn(),
                        updateQuantity: jest.fn(),
                        removeFromCart: jest.fn(),
                        clearCart: jest.fn(),
                        getTotal: jest.fn().mockReturnValue(0),
                    }}
                >
                    <CartScreen />
                </CartContext.Provider>
            );
        });

        const texts = tree!.root.findAllByType('Text').map((node: any) => node.props.children);
        expect(texts).toContain('Your cart is empty');
        expect(texts).toContain('Add some products to get started!');
    });

    it('renders cart item and handles item actions', () => {
        const updateQuantity = jest.fn();
        const removeFromCart = jest.fn();
        let tree: renderer.ReactTestRenderer | any;

        act(() => {
            tree = renderer.create(
                <CartContext.Provider
                    value={{
                        cart: [cartItem],
                        addToCart: jest.fn(),
                        updateQuantity,
                        removeFromCart,
                        clearCart: jest.fn(),
                        getTotal: jest.fn().mockReturnValue(25),
                    }}
                >
                    <CartScreen />
                </CartContext.Provider>
            );
        });

        expect(tree!.root.findAllByType('Text').some((node: any) => node.props.children === 'Total: $25.00')).toBe(false);

        act(() => {
            tree!.root.findAllByType(TouchableOpacity).find((node: any) =>
                node.findAllByType('Text').some((text: any) => text.props.children === '-')
            ).props.onPress();
        });

        expect(updateQuantity).toHaveBeenCalledWith(1, 1);

        act(() => {
            tree!.root.findAllByType(TouchableOpacity).find((node: any) =>
                node.findAllByType('Text').some((text: any) => text.props.children === '+')
            ).props.onPress();
        });

        expect(updateQuantity).toHaveBeenCalledWith(1, 3);

        act(() => {
            tree!.root.findAllByType(TouchableOpacity).find((node: any) =>
                node.findAllByType('Text').some((text: any) => text.props.children === 'Remove')
            ).props.onPress();
        });

        expect(Alert.alert).toHaveBeenCalledWith(
            'Remove Item',
            'Are you sure you want to remove Test Product from your cart?',
            expect.any(Array)
        );
    });
});
