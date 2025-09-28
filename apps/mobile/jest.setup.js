import '@testing-library/jest-native/extend-expect';

// React Native 컴포넌트 mocks
jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => 'TouchableOpacity');
jest.mock('react-native/Libraries/Lists/FlatList', () => 'FlatList');
jest.mock('react-native/Libraries/Text/Text', () => 'Text');
jest.mock('react-native/Libraries/Components/View/View', () => 'View');