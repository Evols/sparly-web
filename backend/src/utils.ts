
export const minEz = (str: string) => {
  return str
    .replace('\n', '') // Remove all line breaks
    .replace(/ *> +</ig, '>') // Turn all sup + space into just a sup
    .replace(/ +< */ig, '<')  // Turn all space + inf into just an inf
    .replace(/  +/ig, ' '); // Turn all double (and more) spaces into just a space
};
