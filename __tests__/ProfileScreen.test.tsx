import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import ProfileScreen from '../src/screens/ProfileScreen';
import { AuthContext } from '../src/context/AuthContext';
import { CartContext } from '../src/context/CartContext';
import LogoutModal from '../src/components/LogoutModal';

const mockUser = {
    id: 1,
    username: 'john.doe',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    image: '',
};

describe('ProfileScreen', () => {
    it('renders user details and opens logout modal', () => {
        const logout = jest.fn(async () => Promise.resolve());
        const clearCart = jest.fn();

        let tree: renderer.ReactTestRenderer | any;

        act(() => {
            tree = renderer.create(
                <AuthContext.Provider
                    value={{
                        user: mockUser,
                        login: jest.fn(),
                        logout,
                    }}
                >
                    <CartContext.Provider
                        value={{
                            cart: [],
                            addToCart: jest.fn(),
                            updateQuantity: jest.fn(),
                            removeFromCart: jest.fn(),
                            clearCart,
                            getTotal: jest.fn(),
                        }}
                    >
                        <ProfileScreen />
                    </CartContext.Provider>
                </AuthContext.Provider>
            );
        });

        expect(
            tree!.root
                .findAllByType('Text')
                .some((node: any) => node.props.children === 'John Doe')
        ).toBe(false);

        expect(
            tree!.root
                .findAllByType('Text')
                .some((node: any) => node.props.children === 'john.doe@example.com')
        ).toBe(true);

        act(() => {
            tree!.root.findAllByType(TouchableOpacity)[0].props.onPress();
        });

        expect(
            tree!.root.findByType(LogoutModal).props.visible
        ).toBe(true);
    });

    it('confirms logout and calls clearCart and logout', async () => {
        const logout = jest.fn(async () => Promise.resolve());
        const clearCart = jest.fn();

        let tree: renderer.ReactTestRenderer;

        await act(async () => {
            tree = renderer.create(
                <AuthContext.Provider
                    value={{
                        user: mockUser,
                        login: jest.fn(),
                        logout,
                    }}
                >
                    <CartContext.Provider
                        value={{
                            cart: [],
                            addToCart: jest.fn(),
                            updateQuantity: jest.fn(),
                            removeFromCart: jest.fn(),
                            clearCart,
                            getTotal: jest.fn(),
                        }}
                    >
                        <ProfileScreen />
                    </CartContext.Provider>
                </AuthContext.Provider>
            );
        });

        await act(async () => {
            tree!.root.findAllByType(TouchableOpacity)[0].props.onPress();
        });

        await act(async () => {
            await tree!.root.findByType(LogoutModal).props.onConfirm();
        });

        expect(clearCart).toHaveBeenCalledTimes(1);
        expect(logout).toHaveBeenCalledTimes(1);
    });
});