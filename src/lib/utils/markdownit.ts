import MarkdownIt from 'markdown-it';

let md: MarkdownIt;

export function getMarkdownIt() {
	if (!md) {
		md = new MarkdownIt({
			linkify: true
		});

		md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
			const aToken = tokens[idx];
			const hrefIndex = aToken.attrIndex('href');
			if (hrefIndex >= 0) {
				aToken.attrPush(['class', `text-blue-500 after:content-['🔗']`]);
				aToken.attrPush(['target', '_blank']);
			}
			return self.renderToken(tokens, idx, options);
		};
	}
	return md;
}
