import React from 'react';
import renderer, { act } from 'react-test-renderer';
import CustomInput from '../src/components/CustomInput';
import { TextInput, TouchableOpacity } from 'react-native';

jest.mock('phosphor-react-native');

describe('CustomInput', () => {
    it('renders text input and password toggle icon', () => {
        let tree: renderer.ReactTestRenderer;

        act(() => {
            tree = renderer.create(
                <CustomInput isPassword value="" onChangeText={() => { }} />
            );
        });

        expect(tree!.root.findByType(TextInput)).toBeTruthy();
        expect(tree!.root.findByType(TouchableOpacity)).toBeTruthy();
    });

    it('toggles secureTextEntry when icon pressed', () => {
        let tree: renderer.ReactTestRenderer;

        act(() => {
            tree = renderer.create(
                <CustomInput isPassword value="" onChangeText={() => { }} />
            );
        });

        const input = tree!.root.findByType(TextInput);
        expect(input.props.secureTextEntry).toBe(true);

        act(() => {
            tree!.root.findByType(TouchableOpacity).props.onPress();
        });

        expect(tree!.root.findByType(TextInput).props.secureTextEntry).toBe(false);
    });
});
