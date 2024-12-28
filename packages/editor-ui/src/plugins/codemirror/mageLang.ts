import { parserWithMetaData as mageParser } from '@mage/codemirror-lang';
import { LanguageSupport, LRLanguage } from '@codemirror/language';
import { parseMixed } from '@lezer/common';
import { javascriptLanguage } from '@codemirror/lang-javascript';

import { mageCompletionSources } from './completions/addCompletions';
import { autocompletion } from '@codemirror/autocomplete';

const mageParserWithNestedJsParser = mageParser.configure({
	wrap: parseMixed((node) => {
		if (node.type.isTop) return null;

		return node.name === 'Resolvable'
			? { parser: javascriptLanguage.parser, overlay: (node) => node.type.name === 'Resolvable' }
			: null;
	}),
});

const mageLanguage = LRLanguage.define({ parser: mageParserWithNestedJsParser });

export function mageLang() {
	return new LanguageSupport(mageLanguage, [
		mageLanguage.data.of({ closeBrackets: { brackets: ['{', '('] } }),
		...mageCompletionSources().map((source) => mageLanguage.data.of(source)),
	]);
}

export const mageAutocompletion = () =>
	autocompletion({ icons: false, aboveCursor: true, closeOnBlur: false });
