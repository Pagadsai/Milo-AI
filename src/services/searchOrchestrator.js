import { searchWeb } from "./search";

export async function searchKnowledge(intent, query) {

  switch (intent) {

    case "COMPANY":
      return await searchWeb(
        `${query} official website LinkedIn`
      );

    case "PROGRAMMING":
      return await searchWeb(
        `${query}
        React documentation
        MDN
        Node.js documentation
        GitHub
        Stack Overflow`
      );

    case "MEDICAL":
      return await searchWeb(
        `${query} WHO CDC NIH`
      );

    case "SCIENCE":
      return await searchWeb(
        `${query} NASA Nature`
      );

    case "NEWS":
      return await searchWeb(
        `${query} latest news`
      );

    default:
      return await searchWeb(query);

  }

}