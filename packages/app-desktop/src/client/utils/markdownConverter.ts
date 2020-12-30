import * as showdown from "showdown";
import { last } from "lodash";

var mediaExtensions = function () {
  const audioExtension = {
    type: "lang",
    regex: /!audio\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/g,
    replace: (_match: string, url: string) => {
      const fileType = last(url.split("."));
      return `<audio controls><source src="${url}" type="audio/${fileType}" preload="none"></source></audio>`;
    },
  };

  return [audioExtension];
};

const converter = new showdown.Converter({
  extensions: [mediaExtensions],
});

converter.setOption("tasklists", true);
converter.setOption("omitExtraWLInCodeBlocks", true);
converter.setOption("noHeaderId", true);
converter.setOption("parseImgDimensions", true);
converter.setOption("disableForced4SpacesIndentedSublists", true);
converter.setOption("simpleLineBreaks", true);
converter.setOption("requireSpaceBeforeHeadingText", true);

export const convertMdToHTML = (md: string) => converter.makeHtml(md);
