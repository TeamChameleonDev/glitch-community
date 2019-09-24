import markdownIt from 'markdown-it';
import markdownEmoji from 'markdown-it-emoji';
import markdownHeadings from 'markdown-it-github-headings';
import markdownSanitizer from 'markdown-it-sanitizer';

const md = ({ allowImages, linkifyHeadings }) => {
    const mdIt = markdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true,
    }).disable('smartquotes');
  
    if (!allowImages) {
      mdIt.disable('image');
    }
    if (linkifyHeadings) {
      const headingOpts = { enableHeadingLinkIcons: false, prefixHeadingIds: false };
      return mdIt.use(markdownHeadings, headingOpts).use(markdownEmoji).use(markdownSanitizer);
    }
    return mdIt.use(markdownEmoji).use(markdownSanitizer);
  };
  
const stripHtml = (html) => {
const regex = /<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi;
return html ? html.replace(regex, '').trim() : '';
};