import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/sign-in/", "/sign-up/"],
      },
    ],
    sitemap: "https://www.hellolifefoundation.com/sitemap.xml",
  };
}
