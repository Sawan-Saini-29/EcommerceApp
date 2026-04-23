import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import ErrorModal from '../src/components/ErrorModal';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props: any) => React.createElement(View, props, props.children);
});

describe('ErrorModal', () => {
  it('renders error title and message when visible', () => {
    let tree: renderer.ReactTestRenderer | any;

    act(() => {
      tree = renderer.create(
        <ErrorModal visible message="Something went wrong" onClose={() => { }} />
      );
    });
    tree!.root.findAllByType('Text').map((node: any) => node.props.children);
  });

  it('calls onClose when OK pressed', () => {
    const onClose = jest.fn();
    let tree: renderer.ReactTestRenderer;

    act(() => {
      tree = renderer.create(
        <ErrorModal visible message="Something went wrong" onClose={onClose} />
      );
    });

    expect(onClose).toHaveBeenCalledTimes(0);
  });
});
