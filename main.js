javascript: (() => {
  /* ブックマークレットとして使用するためラベル必須 */

  function checkYahooNewsUrl(currentUrl) {
    return /^https:\/\/news\.yahoo\.co\.jp/.test(currentUrl);
  }

  function checkPickupUrl(currentUrl) {
    return /^https:\/\/news\.yahoo\.co\.jp\/pickup\//.test(currentUrl);
  }

  function checkArticleUrl(currentUrl) {
    return /^https:\/\/news\.yahoo\.co\.jp\/articles\//.test(currentUrl);
  }

  function findPreloadedState() {
    const scripts = document.getElementsByTagName("script");
    const stateScript = Array.from(scripts).find((script) =>
      script.textContent.startsWith("window.__PRELOADED_STATE__"),
    );
    if (!stateScript) return null;

    const jsonString = stateScript.textContent.replace(
      "window.__PRELOADED_STATE__ = ",
      "",
    );
    return JSON.parse(jsonString);
  }

  function getArticleTitle() {
    const articleTag = document.querySelector("article h1");
    return articleTag ? articleTag.textContent.trim() : null;
  }

  function createGoogleSearchUrl(mediaHostname, articleText) {
    const query = `site:${mediaHostname} ${articleText}`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }

  try {
    const currentUrl = window.location.href;

    if (!checkYahooNewsUrl(currentUrl)) {
      alert("Yahoo!ニュースの記事ではなさそうです🕵️");
      return;
    }

    if (checkPickupUrl(currentUrl)) {
      alert(
        "「…記事全文を読む」をクリックしてからブックマークレットを実行してください🏎️",
      );
      return;
    }

    if (!checkArticleUrl(currentUrl)) {
      alert("外部提供の記事ではなさそうです🕵️");
      return;
    }

    const preloadedState = findPreloadedState();
    if (!preloadedState) {
      alert(
        "リダイレクトするために必要な情報が見つかりませんでした。ブックマークレットの開発者にご連絡ください🧑‍💻",
      );
      return;
    }

    const mediaHostname = new URL(preloadedState.articleDetail.media.mediaUrl)
      .hostname;
    if (!mediaHostname) {
      alert(
        "配信元サイトURLが見つかりませんでした。ブックマークレットの開発者にご連絡ください🧑‍💻",
      );
      return;
    }

    if (mediaHostname === "news.yahoo.co.jp") {
      alert("この記事はYahoo!ニュースオリジナル記事です👍");
      return;
    }

    const articleText = getArticleTitle();
    if (!articleText) {
      alert(
        "記事タイトルが見つかりませんでした。ブックマークレットの開発者にご連絡ください🧑‍💻",
      );
      return;
    }

    const googleSearchUrl = createGoogleSearchUrl(mediaHostname, articleText);
    window.open(googleSearchUrl, "_blank");
  } catch (error) {
    alert(
      `エラーが発生しました。ブックマークレットの開発者にご連絡ください🧑‍💻: ${error.message}`,
    );
  }
})();
