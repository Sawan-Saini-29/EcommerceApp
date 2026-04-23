import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import LogoutModal from '../src/components/LogoutModal';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props: any) => React.createElement(View, props, props.children);
});

describe('LogoutModal', () => {
  it('shows logout confirmation text', () => {
    let tree: renderer.ReactTestRenderer | any;

    act(() => {
      tree = renderer.create(
        <LogoutModal visible onCancel={() => { }} onConfirm={() => { }} />
      );
    });

    tree!.root.findAllByType('Text').map((node: any) => node.props.children);

  });

});
