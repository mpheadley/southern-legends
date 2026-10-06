import { permanentRedirect } from "next/navigation";

// The $7 newsletter tier is retired. One monthly offer lives on /support ($5).
export default function NewsletterPage() {
  permanentRedirect("/support");
}
