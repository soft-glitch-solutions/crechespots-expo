import { Platform } from 'react-native';
import RNRichEditor from 'react-native-pell-rich-editor';

// Use react-native-pell-rich-editor for mobile
const RichTextEditor = Platform.select({
  ios: () => RNRichEditor,
  android: () => RNRichEditor,
  default: () => RNRichEditor,
});

export default RichTextEditor(); 