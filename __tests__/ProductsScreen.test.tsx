import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import ProductsScreen from '../src/screens/ProductsScreen';
import { CartContext } from '../src/context/CartContext';
import apiService from '../src/services/api';

jest.mock('../src/services/api');

const mockedApiService = apiService as jest.Mocked<typeof apiService>;

describe('ProductsScreen', () => {
    beforeEach(() => {
        mockedApiService.get.mockReset();
    });

    it('shows loader while fetching products', async () => {
        mockedApiService.get.mockResolvedValueOnce({ data: { products: [] } } as any);

        let tree: renderer.ReactTestRenderer;
        await act(async () => {
            tree = renderer.create(
                <CartContext.Provider
                    value={{
                        cart: [],
                        addToCart: jest.fn(),
                        updateQuantity: jest.fn(),
                        removeFromCart: jest.fn(),
                        clearCart: jest.fn(),
                        getTotal: jest.fn(),
                    }}
                >
                    <ProductsScreen />
                </CartContext.Provider>
            );
        });
    });

    it('renders products and adds item to cart', async () => {
        const product = {
            id: 1,
            title: 'Product One',
            description: 'Description here',
            price: 10,
            thumbnail: 'http://test.com/product.png',
        };

        mockedApiService.get.mockResolvedValueOnce({ data: { products: [product] } } as any);
        const addToCart = jest.fn();

        let tree: renderer.ReactTestRenderer | any;
        await act(async () => {
            tree = renderer.create(
                <CartContext.Provider
                    value={{
                        cart: [],
                        addToCart,
                        updateQuantity: jest.fn(),
                        removeFromCart: jest.fn(),
                        clearCart: jest.fn(),
                        getTotal: jest.fn(),
                    }}
                >
                    <ProductsScreen />
                </CartContext.Provider>
            );
        });

        expect(mockedApiService.get).toHaveBeenCalledWith('/products');
        const addButton = tree!.root.findAllByType('Text').find((node: any) => node.props.children === 'Add to Cart');
        expect(addButton).toBeTruthy();

        act(() => {
            tree!.root.findAllByType(TouchableOpacity).find((node: any) =>
                node.findAllByType('Text').some((text: any) => text.props.children === 'Add to Cart')
            ).props.onPress();
        });

        expect(addToCart).toHaveBeenCalledWith(product);
    });

    it('shows quantity controls when product already in cart', async () => {
        const product: any = {
            id: 2,
            title: 'Product Two',
            description: 'Desc',
            price: 15,
            thumbnail: 'http://test.com/product2.png',
        };

        mockedApiService.get.mockResolvedValueOnce({ data: { products: [product] } } as any);
        const updateQuantity = jest.fn();

        let tree: renderer.ReactTestRenderer | any;
        await act(async () => {
            tree = renderer.create(
                <CartContext.Provider
                    value={{
                        cart: [{ product, quantity: 2 }],
                        addToCart: jest.fn(),
                        updateQuantity,
                        removeFromCart: jest.fn(),
                        clearCart: jest.fn(),
                        getTotal: jest.fn(),
                    }}
                >
                    <ProductsScreen />
                </CartContext.Provider>
            );
        });

        expect(tree!.root.findAllByType('Text').some((node: any) => node.props.children === '2')).toBe(false);
        act(() => {
            tree!.root.findAllByType(TouchableOpacity).find((node: any) =>
                node.findAllByType('Text').some((text: any) => text.props.children === '-')
            ).props.onPress();
        });

        expect(updateQuantity).toHaveBeenCalledWith(2, 1);
    });
});
