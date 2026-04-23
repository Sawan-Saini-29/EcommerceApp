import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity, TextInput } from 'react-native';
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

    it('renders search input field', async () => {
        mockedApiService.get.mockResolvedValueOnce({ data: { products: [] } } as any);

        let tree: renderer.ReactTestRenderer | any;
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

        const searchInput = tree!.root.findByType(TextInput);
        expect(searchInput).toBeTruthy();
        expect(searchInput.props.placeholder).toBe('Search products...');
    });

    it('filters products based on search term', async () => {
        const products = [
            { id: 1, title: 'Apple iPhone', description: 'Phone', price: 999, thumbnail: 'http://test.com/1.png' },
            { id: 2, title: 'Samsung Galaxy', description: 'Phone', price: 799, thumbnail: 'http://test.com/2.png' },
            { id: 3, title: 'Apple iPad', description: 'Tablet', price: 599, thumbnail: 'http://test.com/3.png' },
        ];

        mockedApiService.get.mockResolvedValueOnce({ data: { products } } as any);

        let tree: renderer.ReactTestRenderer | any;
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

        const searchInput = tree!.root.findByType(TextInput);
        act(() => {
            searchInput.props.onChangeText('Apple');
        });

        const textNodes = tree!.root.findAllByType('Text');
        const appleProducts = textNodes.filter((node: any) => 
            node.props.children === 'Apple iPhone' || node.props.children === 'Apple iPad'
        );
        expect(appleProducts.length).toBeGreaterThan(0);
    });

    it('shows clear button when search term is entered', async () => {
        mockedApiService.get.mockResolvedValueOnce({ data: { products: [] } } as any);

        let tree: renderer.ReactTestRenderer | any;
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

        const searchInput = tree!.root.findByType(TextInput);
        act(() => {
            searchInput.props.onChangeText('test');
        });

        const clearButton = tree!.root.findAllByType('Text').find((node: any) => node.props.children === '✕');
        expect(clearButton).toBeTruthy();
    });

    it('clears search when clear button is pressed', async () => {
        mockedApiService.get.mockResolvedValueOnce({ data: { products: [] } } as any);

        let tree: renderer.ReactTestRenderer | any;
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

        const searchInput = tree!.root.findByType(TextInput);
        act(() => {
            searchInput.props.onChangeText('test');
        });

        const clearButton = tree!.root.findAllByType(TouchableOpacity).find((node: any) =>
            node.findAllByType('Text').some((text: any) => text.props.children === '✕')
        );

        act(() => {
            clearButton!.props.onPress();
        });

        expect(searchInput.props.value).toBe('');
    });

    it('shows no products found message when search returns no results', async () => {
        const products = [
            { id: 1, title: 'Apple iPhone', description: 'Phone', price: 999, thumbnail: 'http://test.com/1.png' },
        ];

        mockedApiService.get.mockResolvedValueOnce({ data: { products } } as any);

        let tree: renderer.ReactTestRenderer | any;
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

        const searchInput = tree!.root.findByType(TextInput);
        act(() => {
            searchInput.props.onChangeText('Samsung');
        });

        const noProductsText = tree!.root.findAllByType('Text').find((node: any) => 
            node.props.children === 'No products found'
        );
        expect(noProductsText).toBeTruthy();
    });

    it('shows all products when search is cleared', async () => {
        const products = [
            { id: 1, title: 'Apple iPhone', description: 'Phone', price: 999, thumbnail: 'http://test.com/1.png' },
            { id: 2, title: 'Samsung Galaxy', description: 'Phone', price: 799, thumbnail: 'http://test.com/2.png' },
        ];

        mockedApiService.get.mockResolvedValueOnce({ data: { products } } as any);

        let tree: renderer.ReactTestRenderer | any;
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

        const searchInput = tree!.root.findByType(TextInput);
        
        // Search for a product
        act(() => {
            searchInput.props.onChangeText('Apple');
        });

        // Clear the search
        act(() => {
            searchInput.props.onChangeText('');
        });

        // Both products should be visible
        const productTitles = tree!.root.findAllByType('Text').filter((node: any) =>
            node.props.children === 'Apple iPhone' || node.props.children === 'Samsung Galaxy'
        );
        expect(productTitles.length).toBe(2);
    });
});

