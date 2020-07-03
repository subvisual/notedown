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

  const youtubeExtension = {
    type: "lang",
    regex: /!youtube\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/g,
    replace: (match: string, url: string) => {
      try {
        const id = url
          .split("?")[1]
          .split("&")
          .filter((q) => q.startsWith("v"))[0]
          .split("=")[1];

        return `<div class="youtube"><iframe width="100%" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      } catch (e) {
        return match;
      }
    },
  };

  return [audioExtension, youtubeExtension];
};

const converter = new showdown.Converter({
  extensions: [mediaExtensions],
});

converter.setOption("tasklists", true);

export const convertMdToHTML = (md: string) => converter.makeHtml(md);
