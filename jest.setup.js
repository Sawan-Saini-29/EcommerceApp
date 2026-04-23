import 'react-native-gesture-handler/jestSetup';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

global.__reanimatedWorkletInit = jest.fn();

global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('react-native-reanimated', () => ({
    default: {
        call: () => { },
    },
    useSharedValue: jest.fn(v => ({ value: v })),
    useAnimatedStyle: jest.fn(() => ({})),
    useDerivedValue: jest.fn(fn => fn()),
    withTiming: jest.fn(v => v),
    withSpring: jest.fn(v => v),
    runOnJS: jest.fn(fn => fn),
}));

jest.mock('react-native-worklets', () => ({
    __esModule: true,
}));

jest.mock('@react-navigation/drawer', () => ({
    createDrawerNavigator: jest.fn(() => ({
        Navigator: ({ children }) => children,
        Screen: ({ children }) => children,
    })),
}));

jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: () => ({
        Navigator: ({ children }) => children,
        Screen: ({ children }) => children,
    }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native/Libraries/Modal/Modal', () => {
    const React = require('react');
    return ({ children }) => <>{children}</>;
});

jest.mock('react-native/Libraries/Modal/Modal', () => {
    const React = require('react');
    return ({ children }) => children;
});

jest.mock('./src/components/ErrorModal', () => 'ErrorModal');
jest.mock('./src/components/LogoutModal', () => 'LogoutModal');

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        replace: jest.fn(),
        navigate: jest.fn(),
        dispatch: jest.fn(),
    }),
}));

