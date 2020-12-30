export const isHref = (text: string) =>
  text.match(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  );

export const isImageSrc = (text: string) =>
  text.endsWith("png") ||
  text.endsWith("jpg") ||
  text.endsWith("jpeg") ||
  text.endsWith("svg");

export const isAudioSrc = (text: string) =>
  text.endsWith("mp3") || text.endsWith("wav");

export const matchMdImage = (text: string) => {
  const match = text.match(
    /!\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/
  );

  if (!match) return null;

  return { src: match[1].split(" ")[0] };
};

interface MatchMdListItemResponse {
  type: "unordered" | "ordered";
  empty: boolean;
  nextElement: string;
}

export const matchMdListItem = (text: string): MatchMdListItemResponse => {
  const match = text.match(/^([\d\*\-])(\.?) (.*)/);

  if (!match) return null;

  const type = match[1] === "*" || match[1] === "-" ? "unordered" : "ordered";

  return {
    type,
    empty: match[3] === "",
    nextElement:
      type === "unordered"
        ? `${match[1]}${match[2]} `
        : `${parseInt(match[1]) + 1}${match[2]} `,
  };
};
