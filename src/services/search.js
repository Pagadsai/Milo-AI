const API_KEY = import.meta.env.VITE_TAVILY_API_KEY;

export async function searchWeb(query) {
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: API_KEY,
        query,
        search_depth: "advanced",
        max_results: 5,
        include_answer: true,
        include_images: false,
        include_raw_content: false,
      }),
    });

    const data = await res.json();

    if (!data.results) return "";
    return data.results
      .map(
        (item, index) => `
    Source ${index + 1}

    Title:
    ${item.title}

    Content:
    ${item.content}

    URL:
    ${item.url}
    `
      )
      .join("\n---------------------------\n");

  } catch (err) {
    console.error(err);
    return "";
  }
}