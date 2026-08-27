type Provider = "youtube" | "vimeo" | "bunny";

export interface ParsedVideo {
  provider: Provider;
  embedUrl(startSeconds?: number, autoplay?: boolean): string;
}

export function parseVideoUrl(url: string): ParsedVideo | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "youtu.be") {
    const id =
      host === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v");
    if (!id) return null;

    return {
      provider: "youtube",
      embedUrl(startSeconds = 0, autoplay = false) {
        const params = new URLSearchParams();
        if (startSeconds > 0) params.set("start", String(Math.floor(startSeconds)));
        if (autoplay) params.set("autoplay", "1");
        const qs = params.toString();
        return `https://www.youtube-nocookie.com/embed/${id}${qs ? `?${qs}` : ""}`;
      },
    };
  }

  if (host === "vimeo.com") {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    if (!id) return null;

    return {
      provider: "vimeo",
      embedUrl(startSeconds = 0, autoplay = false) {
        const params = new URLSearchParams();
        if (autoplay) params.set("autoplay", "1");
        const qs = params.toString();
        const hash = startSeconds > 0 ? `#t=${Math.floor(startSeconds)}s` : "";
        return `https://player.vimeo.com/video/${id}${qs ? `?${qs}` : ""}${hash}`;
      },
    };
  }

  if (host === "mediadelivery.net" || host.endsWith(".b-cdn.net")) {
    const segments = parsed.pathname.split("/").filter(Boolean);
    const [libraryId, videoId] = segments;
    if (!libraryId || !videoId) return null;

    return {
      provider: "bunny",
      embedUrl(startSeconds = 0, autoplay = false) {
        const params = new URLSearchParams();
        if (startSeconds > 0) params.set("t", String(Math.floor(startSeconds)));
        if (autoplay) params.set("autoplay", "true");
        const qs = params.toString();
        return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}${qs ? `?${qs}` : ""}`;
      },
    };
  }

  return null;
}
