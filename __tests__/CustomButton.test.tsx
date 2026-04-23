import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import CustomButton from '../src/components/CustomButton';

describe('CustomButton', () => {
    it('renders title correctly', () => {
        let tree: renderer.ReactTestRenderer;

        act(() => {
            tree = renderer.create(
                <CustomButton title="Submit" onPress={() => { }} />
            );
        });
    });

    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        let tree: renderer.ReactTestRenderer;

        act(() => {
            tree = renderer.create(
                <CustomButton title="Submit" onPress={onPress} />
            );
        });

        act(() => {
            tree!.root.findByType(TouchableOpacity).props.onPress();
        });

        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('disables button while loading', () => {
        let tree: renderer.ReactTestRenderer | any;

        act(() => {
            tree = renderer.create(
                <CustomButton title="Submit" onPress={() => { }} loading />
            );
        });

        const button = tree!.root.findByType(TouchableOpacity);
        expect(button.props.disabled).toBe(true);
        expect(tree!.root.findByType('ActivityIndicator')).toBeTruthy();
    });
});
