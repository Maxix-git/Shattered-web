<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public pages in TanStack file routes with a shared community shell; this preserves consistent navigation and page-specific metadata.
- Use one browser-safe sample dataset for all preview pages; this keeps player identities and records consistent without implying live server integration.
- Keep sensitive profile inventory hidden unless the viewer owns it or the player shares it; this makes the preview follow the eventual privacy model.
