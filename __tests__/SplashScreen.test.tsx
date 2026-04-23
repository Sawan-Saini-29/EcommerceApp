import React from 'react';
import renderer, { act } from 'react-test-renderer';
import SplashScreen from '../src/screens/SplashScreen';

jest.useFakeTimers();

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        replace: jest.fn(),
        navigate: jest.fn(),
        dispatch: jest.fn(),
    }),
}));

jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const { View } = require('react-native');

    return {
        SafeAreaView: ({ children }: any) => (
            <View>{children}</View>
        ),
    };
});

describe('SplashScreen', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    it('navigates after timeout', () => {
        const navigation = {
            replace: jest.fn(),
        };

        let tree: renderer.ReactTestRenderer;

        act(() => {
            tree = renderer.create(
                <SplashScreen navigation={navigation} />
            );
        });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(navigation.replace).toHaveBeenCalledWith('Login');

        act(() => {
            tree.unmount();
        });
    });

});