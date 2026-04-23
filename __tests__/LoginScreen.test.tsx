import React from 'react';
import renderer, { act } from 'react-test-renderer';
import LoginScreen from '../src/screens/LoginScreen';
import { AuthContext } from '../src/context/AuthContext';
import ErrorModal from '../src/components/ErrorModal';
import CustomInput from '../src/components/CustomInput';
import CustomButton from '../src/components/CustomButton';
import apiService from '../src/services/api';

jest.mock('../src/services/api');

const mockedApiService = apiService as jest.Mocked<typeof apiService>;

describe('LoginScreen', () => {
    beforeEach(() => {
        mockedApiService.post.mockReset();
    });

    it('shows error modal when fields are empty', async () => {
        const login = jest.fn();
        let tree: renderer.ReactTestRenderer;

        await act(async () => {
            tree = renderer.create(
                <AuthContext.Provider value={{ user: null, login, logout: jest.fn() }}>
                    <LoginScreen />
                </AuthContext.Provider>
            );
        });

        await act(async () => {
            tree!.root.findByType(CustomButton).props.onPress();
        });

        expect(tree!.root.findByType(ErrorModal).props.visible).toBe(true);
        expect(tree!.root.findByType(ErrorModal).props.message).toBe('Please enter username and password');
        expect(login).not.toHaveBeenCalled();
    });

    it('submits login and calls context login on success', async () => {
        const login = jest.fn();
        mockedApiService.post.mockResolvedValueOnce({
            data: {
                accessToken: 'token123',
                refreshToken: 'refresh123',
                id: 1,
                username: 'john.doe',
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe',
                gender: 'male',
                image: 'https://test.com/pic.png',
            },
        } as any);

        let tree: renderer.ReactTestRenderer;
        await act(async () => {
            tree = renderer.create(
                <AuthContext.Provider value={{ user: null, login, logout: jest.fn() }}>
                    <LoginScreen />
                </AuthContext.Provider>
            );
        });

        act(() => {
            const usernameInput = tree!.root.findAllByType(CustomInput)[0].props;
            usernameInput.onChangeText('john.doe');
            const passwordInput = tree!.root.findAllByType(CustomInput)[1].props;
            passwordInput.onChangeText('password');
        });

        await act(async () => {
            tree!.root.findByType(CustomButton).props.onPress();
        });

        expect(mockedApiService.post).toHaveBeenCalledWith('/auth/login', {
            username: 'john.doe',
            password: 'password',
        });
        expect(login).toHaveBeenCalledWith(
            expect.objectContaining({ username: 'john.doe', email: 'john.doe@example.com' }),
            'token123',
            'refresh123'
        );
    });
});
