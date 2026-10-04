# Reference audit

Source priority: user's identical pasted briefs; September 29 saved Home, Love Story, Details, FAQ and RSVP exports; live https://platypus-2th1jn.my.canva.site/.

All five exports and accompanying folders are preserved in `reference/`. The generated `*-data.json` files decode the embedded design data; `*.json` extract visible text, image references and links. **These files are reference-only, not served publicly or executed by the production app.** They contain Canva runtime/bootstrap material and should not be deployed.

## Navigation

Reference #page-0 → /; #page-1 → /love-story; #page-2 → /details; #page-3 → /faq; #page-4 → /rsvp. Standard Next.js links support direct access, refresh and back. No Canva runtime, embeds or analytics are used in production.

## Design and assets

`asset-map.json` maps all 18 distinct downloaded raster assets to named local files. `asset-contact-sheet.jpg` provides a visual index. `recovered-vector-map.json` records five vector assets retrieved from the rendered live site after direct downloads returned HTTP 403. The ornamental RSVP/date border and section flourish are used locally. Production recoloring matches the grey ornamental treatment; original download paths are recorded in the manifest.

Source colors: navigation #9aa5b6, ivory #fffef4, body brown #402825, pale sections #e9ecf1 and #dde1e6, ornamental grey #92969c. Main faded text was darkened within the same palette. Dress-code inspiration is **#7d894a, #972626, #fcc0c5**, not the overall website palette. This is preserved from the latest export, despite the red swatch.

Source fonts: Cormorant SC, Cormorant Garamond, Pinyon Script, Allison, Shelley Script, Garamond and EB Garamond (plus Arimo used in platform elements). Open-source Cormorant SC, Cormorant Garamond, Pinyon Script and Allison are hosted locally with OFL notices. Shelley Script and the unspecified Garamond usage rights were not supplied. Pinyon and Cormorant are the documented replacements. Font inventory retains source IDs, face weights and URLs. No claim of identical typography is made.

Home: original frosted lilies, separate editable names, original curtain illustration, editable invitation and M/D lettering, wedding countdown, original envelope with separately layered photo and ornamental frame, original swans, recovered RSVP border. Story: opening paragraph, early couple portrait in oval frame, original body paragraphs, rings photograph in horizontal frame, closing monogram. Details: venue photo in rectangular frame; floral textures; swan background in dark travel section; timeline; separate Kaunas and venue overnight panels; source dress palette; gifts. FAQ: original tilted frame and bouquet photo. RSVP uses the original subdued field and choice treatment with the requested household model.

## Animations

Observed live: content fades in after navigation and portions of headings/text appear in sequence; countdown updates once per second. The exported element `X` fields include encoded variants (e.g. `{A?: B, A: 26, B: {C: E, G: {A: 6530612.24489796}}}`), but these do not establish reliable durations or triggers without Canva's runtime. Section animation lists are empty in the recovered design object. The site preserves decoded source records rather than claiming complete interpretation.

Reconstruction: a conservative 700 ms opacity fade on first intersection of public headings and framed photos, once per route mount. This duration and coverage are **approximations**, not verified exact matches. RSVP controls do not animate and language changes do not restart the observer. Reduced-motion bypasses the effects; content defaults to visible if JS fails. Countdown is independently implemented, stops at zero, and defaults to the start of September 4 in Lithuania, not a confirmed ceremony time. Precise motion parity requires a short recording of any important interaction beyond these observed fades.

## Missing or unresolved references

- No separate screenshot files were included among the named attachments. Visual inspection uses all five HTML exports plus live browser views at matching viewports.
- No usable map, venue or registry destination was attached to the apparent buttons in the latest saved Details HTML. Buttons are honestly disabled until configured.
- Shelley Script independent hosting permission/file and Garamond licensing are not established. Documented open-source replacements are in use.
- Responsive reflow is deliberate; it is not an entire Canva canvas shrunk to a phone. Exact pixel and animation equivalence is not claimed.

## Copy to review (not silently rewritten)

- The story repeats a similar 'everything still to come' sentiment in consecutive closing paragraphs.
- 'from the very beginning, middle and end' is unusual wording and retained.
- 'Can i wear white?' capitalization is retained in English data; heading styling may render small caps.
- Source venue spelling varies between Villa 9 Vejai and 9 Vėjai; source display copy is retained where present.
- The travel times are inherited source claims, not independently revalidated transport advice.
- Source countdown used +02:00 in September; corrected to Lithuania's +03:00.
- Both visible old May RSVP deadlines were replaced. Old source exports remain untouched only in the private reference directory.
- Norwegian and Lithuanian translations are complete drafts requiring the couple's review before launch.
