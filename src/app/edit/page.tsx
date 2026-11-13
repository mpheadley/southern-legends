"use client";

import { EditorPage } from "@headley/gathersites/client";
import { HOME_EDITOR } from "@/lib/content";

export default function Edit() {
  return <EditorPage config={HOME_EDITOR} />;
}
